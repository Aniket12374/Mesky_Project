import { Modal, Switch, Input } from "antd";
import React, { useEffect, useState } from "react";
import _ from "lodash";
import { ProductCard } from "../../utils";
import {
  errorAmountText,
  orderBalanceNegError,
  OrderUpdateReasons,
  previewHeading,
  refundQtyOptions,
  refundReasons,
  editOrderHeading,
  totalQtyOptions,
} from "./CustomerConstants";
import {
  getCookie,
  getCookieOrderVal,
  getCookieWalletBalance,
  setCookie,
} from "../../services/cookiesFunc";
import { httpVendorUpload } from "../../services/api-client";
import {
  updateOrder,
  updateRefundOrder,
} from "../../services/customerOrders/CustomerOrderService";
import toast from "react-hot-toast";
import { QueryClient, useQueryClient } from "react-query";

function EditExistingDeliveredOrder({
  data,
  fetching,
  open,
  setOpen,
  product,
  orderId,
  deliveredDate,
  isTmrOrder,
  isRefundOrder,
  refetchOrderUid,
}) {
  const prodQuantity = product?.quantity;
  const prodOffPrice = product?.unit_price || product?.offer_price;
  const initialPrice = prodQuantity * prodOffPrice;

  const selectReasonOptions = isTmrOrder ? OrderUpdateReasons : refundReasons;
  const [refundData, setRefundData] = useState({
    qty: prodQuantity,
    amount: 0,
  });

  const [reason, setReason] = useState("");
  const [reasonDropDown, setReasonDropdown] = useState("");
  const [images, setImages] = useState([]);
  const [tmrOrderQty, setTmrOrderQty] = useState(prodQuantity);
  const [errors, setErrors] = useState([]);
  const closeModal = () => setOpen(false);

  useEffect(() => {
    const { reason: miscReason = "" } = data?.misc || {};
    const refundedData = data?.refund_misc || {};
    const {
      refund_amount: refundAmount = 0,
      refund_qty: refundQty = 0,
      refund_reason: refundReason = "",
      refund_images: refundImgs = [],
    } = refundedData;

    const orderReason = !isRefundOrder ? miscReason : refundReason;
    const [orderReasonText = "", orderReasonDd = ""] = orderReason.split("-");

    setReasonDropdown(orderReasonDd || selectReasonOptions[0]);
    setTmrOrderQty(prodQuantity);
    setReason(orderReasonText);
    setRefundData({
      qty: !isRefundOrder ? prodQuantity : refundQty,
      amount: !isRefundOrder ? 0 : refundAmount,
    });
    setImages(refundImgs);
  }, [data]);

  const resetData = () => {
    setReason("");
    setReasonDropdown("");
    setImages([]);
    setTmrOrderQty(prodQuantity);
    setErrors([]);
  };

  const handleUpload = (event) => {
    let files = event.target.files;
    if (files.length === 0) {
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file, file.name);
    });

    httpVendorUpload
      .post("/api/upload/multiple-image", formData)
      .then((res) => {
        const links = res.data.links;
        setImages((prev) => [...prev, ...links]);
      })
      .catch((err) => console.log(err));
  };

  const handleRemoveImg = (index) => {
    setImages((prev) => [
      ...images.slice(0, index),
      ...images.slice(index + 1, images.length),
    ]);
  };

  const handleRefund = (key, value) => {
    setRefundData((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (key == "amount") {
      value > refundData?.qty * prodOffPrice
        ? setErrors((prev) => _.uniq([...prev, errorAmountText]))
        : setErrors((prev) => _.filter((prev) => prev == errorAmountText));
    }
  };

  const walletBalance = getCookieWalletBalance;
  const currentOrderVal = getCookieOrderVal;
  const diffOrderVal = (tmrOrderQty - prodQuantity) * product?.offer_price;

  const presentOrderVal = currentOrderVal + diffOrderVal;
  const refundOrderVal = currentOrderVal - refundData?.amount;
  const isZeroOrderQty = Number(tmrOrderQty) !== 0;

  const isNegativeBalance = () => {
    if (!isTmrOrder) return false;
    return isZeroOrderQty ? presentOrderVal > walletBalance : false;
  };

  const isEditOrderDisabled = () => {
    if (!isZeroOrderQty) return false;
    return negBalance || prodQuantity === tmrOrderQty;
  };

  const negBalance = isNegativeBalance();
  const disableNewOrder = isEditOrderDisabled();
  const disableRefund = errors.length > 0;
  const disableBtn = isTmrOrder ? disableNewOrder : disableRefund;
  const queryClient = useQueryClient();

  const handleSubmitSuccess = () => {
    toast.success("Updated Successfully!");
    resetData();
    refetchOrderUid();
    setCookie("currentOrderVal", isTmrOrder ? presentOrderVal : refundOrderVal);
    queryClient.invalidateQueries("getOrders");
    closeModal();
  };

  const handleSubmit = () => {
    const finalReason = `${reason}-${reasonDropDown}`;
    const { amount, qty } = refundData;

    const refundPayload = {
      amount: Number(amount),
      reason: finalReason,
      item_uid: Number(`${orderId}000`),
      refund_qty: Number(qty),
      refund_images: images,
    };

    const updateOrderPayload = {
      qty: Number(tmrOrderQty),
      orderitem_id: Number(product?.id),
      reason: finalReason,
    };

    const payload = isTmrOrder ? updateOrderPayload : refundPayload;
    const api = isTmrOrder ? updateOrder : updateRefundOrder;

    if (!reason) {
      return toast.error("Please write the reason!");
    }

    if (!isTmrOrder && payload?.amount === 0) {
      return toast.error("Please check the amount, Amount shouldn't be zero");
    }

    api(payload)
      .then(() => handleSubmitSuccess())
      .catch((err) => {
        toast.error("Update not successfully!");
        console.log({ err });
      });
  };

  const finalPrice = tmrOrderQty * prodOffPrice;

  return (
    <Modal
      open={open}
      onCancel={closeModal}
      width={1200}
      footer={null}
      className='roboto-400'
    >
      {fetching ? (
        <>Loading</>
      ) : (
        <div className='flex space-x-10 mt-5'>
          <div className='w-[60%]'>
            <div>
              <span className='font-bold gray-color text-sm'>Order ID: </span>
              <span className='font-medium'>{orderId}</span>
            </div>
            <div className='text-xs font-bold'>
              <span className='gray-color'>Delivery Date: </span>
              <span>{deliveredDate}</span>
            </div>
            <div className='my-5 font-medium'>
              {editOrderHeading(isRefundOrder, isTmrOrder)}
            </div>
            <ProductCard
              product={product}
              quantity={prodQuantity}
              showQty={false}
              className='customer-shadow mt-2 p-2 rounded-md'
            >
              {!isTmrOrder ? (
                <div className='flex flex-wrap mt-1'>
                  <div className='qty'>
                    <div className='gray-color'>Qty</div>
                    <div>{prodQuantity}</div>
                  </div>
                  <div className='price text-center mx-3'>
                    <div className='gray-color'>Price</div>
                    <div className='flex space-x-2'>
                      {/* <span> ₹{product?.total_price}</span> */}
                      <span> ₹{initialPrice}</span>
                      {/* <span className='line-through'>
                        {product?.selling_price * quantity}
                      </span> */}
                    </div>
                  </div>
                  <div className='grid grid-cols-3'>
                    <div className='refund-selection'>
                      <select
                        value={refundData?.qty}
                        onChange={(e) => handleRefund("qty", e.target.value)}
                        className='border border-gray-200 rounded-md p-1'
                        disabled={isRefundOrder}
                      >
                        {refundQtyOptions(prodQuantity)?.map((x) => (
                          <option value={x}>Refund Qty {x}</option>
                        ))}
                      </select>
                    </div>

                    <div className='refund-input'>
                      <input
                        type='text'
                        placeholder='Refund amount'
                        value={refundData?.amount}
                        disabled={isRefundOrder}
                        onChange={(e) => handleRefund("amount", e.target.value)}
                        className='border border-gray-200 rounded-md w-32 p-1 foucs:border-gray-200 focus:outline-none'
                      />
                      <div className='text-xs gray-color'>
                        Max {prodOffPrice * refundData?.qty}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='flex items-center space-x-3'>
                  <div className='quantity-change'>
                    <label className='mr-2'>Qty:</label>
                    <select
                      value={tmrOrderQty}
                      onChange={(e) => setTmrOrderQty(e.target.value)}
                      className='border border-gray-200 rounded-md p-2'
                    >
                      {totalQtyOptions?.map((qtyOption) => (
                        <option value={qtyOption}>{qtyOption}</option>
                      ))}
                    </select>
                  </div>
                  <div className='price text-center mx-2'>
                    <div className='gray-color'>Price</div>
                    <div className='flex space-x-2'>
                      <span>₹{prodOffPrice * tmrOrderQty}</span>
                      <span className='line-through'>
                        ₹{product?.selling_price * tmrOrderQty}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {errors?.map((error) => (
                <div className='text-red-400'>{error}</div>
              ))}
            </ProductCard>
            <div className='mt-5 mb-2 font-medium'>Update Comments *</div>
            <div className='comment-dropdown'>
              <select
                value={reasonDropDown}
                onChange={(e) => setReasonDropdown(e.target.value)}
                placeholder={
                  isTmrOrder
                    ? "Please Select the refund Reason"
                    : "Please Select the Order Edit Reason"
                }
                disabled={isRefundOrder}
                className='w-full border-2 border-gray-200 p-1 focus:outline-none rounded-md mb-2'
              >
                {selectReasonOptions.map((reasonOption) => (
                  <option>{reasonOption}</option>
                ))}
              </select>
            </div>
            <Input
              type='text'
              value={reason}
              className='mb-5'
              disabled={isRefundOrder}
              onChange={(e) => setReason(e.target.value)}
            />
            <ImageUpload
              images={images}
              isRefundOrder={isRefundOrder}
              handleRemoveImg={handleRemoveImg}
              handleUpload={handleUpload}
            />
          </div>
          <div className='second-part w-[40%]'>
            <div className='roboto-500'>
              {previewHeading(isRefundOrder, isTmrOrder)}
            </div>
            <ProductCard
              product={product}
              quantity={prodQuantity}
              showQty={false}
              className='customer-shadow mt-2 p-2 rounded-md'
            >
              {!isTmrOrder ? (
                <div className='flex space-x-3 mt-1'>
                  <div className='price text-center'>
                    <div className='gray-color'>Price</div>
                    <div className='flex space-x-2'>
                      <span> ₹{initialPrice}</span>
                      <span className='line-through'>
                        ₹{product?.selling_price * prodQuantity}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className='gray-color'>Refund Qty</div>
                    <div className='text-center'>{refundData?.qty}</div>
                  </div>
                  <div>
                    <div className='gray-color'>Refund Amount</div>
                    <div className='text-center'>{refundData?.amount}</div>
                  </div>
                </div>
              ) : (
                <div className='flex space-x-3'>
                  <div className='quantity'>
                    <div className='gray-color'>Quantity</div>
                    <div>{tmrOrderQty}</div>
                  </div>
                  <div className='price text-center mx-2'>
                    <div className='gray-color'>Price</div>
                    <div className='flex space-x-2'>
                      <span>₹{prodOffPrice * tmrOrderQty}</span>
                      <span className='line-through'>
                        ₹{product?.selling_price * tmrOrderQty}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </ProductCard>
            <Summary
              isTmrOrder={isTmrOrder}
              currentOrderVal={currentOrderVal}
              amountPaid={initialPrice}
              refundAmount={refundData?.amount}
              refundTotal={initialPrice - refundData?.amount}
              tmrPrice={finalPrice}
              tmrOrderPaid={initialPrice}
              tmrTotal={initialPrice - finalPrice}
            />
            {orderBalanceNegError(negBalance)}
            {!isRefundOrder && (
              <div className='submit-btn mt-5 flex justify-end'>
                <button
                  className={`mt-5 w-64 text-white p-2 float-right rounded-md ${
                    disableBtn ? "bg-[#ACACAC]" : "bg-[#FB8171]"
                  }`}
                  disabled={disableBtn}
                  onClick={handleSubmit}
                >
                  {isTmrOrder ? "Update Order" : "Create Refund"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

const ImageUpload = ({
  isRefundOrder,
  handleUpload,
  images,
  handleRemoveImg,
}) => {
  return (
    <div>
      <div className='upload-btn'>
        <div className='bg-[#EEEEEE] flex flex-col justify-center items-center p-2 my-2'>
          <label
            className='p-2 border-dashed border-2 bg-white text-center w-10 h-10 mb-3'
            for='images_upload'
          >
            +
          </label>
          <input
            type='file'
            className={"border-1 border-gray-300 hidden"}
            accept='image/png, image/jpeg'
            multiple
            id='images_upload'
            disabled={isRefundOrder}
            onChange={handleUpload}
          />

          <div
            className={`text-sm font-medium ${
              isRefundOrder ? "gray-color" : ""
            }`}
          >
            Upload or Drag & Drag Supporting Images *
          </div>
        </div>
      </div>
      <div className='preview-images flex space-x-3 overflow-auto'>
        {images.map((x, index) => (
          <div className='relative' style={{ width: "100px", height: "90px" }}>
            <p
              className='flex justify-end absolute'
              style={{
                zIndex: "110",
                width: "100px",
              }}
            >
              <div
                className='bg-red-500 cursor-pointer rounded-full flex items-center justify-center text-white p-2 w-2 h-2'
                onClick={() => handleRemoveImg(index)}
              >
                x
              </div>
            </p>
            <div className='absolute'>
              <img
                src={x}
                alt={`${x}_${index}`}
                className='edit-delivered-order'
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Summary = ({
  isTmrOrder,
  amountPaid,
  refundAmount,
  currentOrderVal,
  tmrPrice,
  tmrOrderPaid,
}) => {
  const walletBalance = getCookie("walletBalance");
  const negPriceDiff = tmrOrderPaid - tmrPrice < 0;

  const refundOrderData = {
    "Amount Paid": amountPaid,
    "Refund Amount": refundAmount,
    "Refund Total": refundAmount,
  };
  const newOrderData = {
    "Total Price": tmrPrice,
    "Already Deducted": tmrOrderPaid,
    ...(negPriceDiff && {
      "To be Paid": Math.abs(tmrOrderPaid - tmrPrice),
    }),
    ...(!negPriceDiff && {
      "To be Refunded": Math.abs(tmrOrderPaid - tmrPrice),
    }),
  };

  const refundSummary = {
    "Total Refund": refundAmount,
    "Grand Total": refundAmount,
  };

  const newOrderSummary = {
    "Available Wallet Balance": walletBalance - currentOrderVal,
    ...(negPriceDiff && {
      "To Deduct from Wallet": Math.abs(tmrOrderPaid - tmrPrice),
    }),
    ...(!negPriceDiff && {
      "To be Refunded To wallet": Math.abs(tmrOrderPaid - tmrPrice),
    }),
  };
  const summaryObj = isTmrOrder ? newOrderData : refundOrderData;
  const summaryTotal = isTmrOrder ? newOrderSummary : refundSummary;
  return (
    <React.Fragment>
      <div className='p-5 customer-shadow mb-5 roboto-400'>
        <div className='font-semibold mb-3 mt-1'>
          {isTmrOrder ? "New Order Details" : "Refund Details"}
        </div>
        {Object.entries(summaryObj).map(([key, value], index) => (
          <div
            className={`${
              index == 2 && "font-semibold"
            } flex justify-between mb-2`}
          >
            <div>{key}</div>
            <div> ₹{value}</div>
          </div>
        ))}
        {isTmrOrder && !negPriceDiff && amountPaid - refundAmount > 150 && (
          <div className='text-[#F8A603]'>
            * Order Refunds above 150 need approval before execution
          </div>
        )}
      </div>
      <div className='order-summary customer-shadow p-5 mb-5'>
        <div className='font-semibold mb-3'>Order Summary</div>
        {Object.entries(summaryTotal).map(([summaryKey, summaryVal], index) => (
          <div
            className={`${
              index == 1 && "font-semibold"
            } flex justify-between mb-2`}
          >
            <div>{summaryKey}</div>
            <div> ₹{summaryVal}</div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default EditExistingDeliveredOrder;
