import { Modal, Switch, Input } from "antd";
import React, { useEffect, useState } from "react";
import _ from "lodash";
import { ProductCard } from "../../utils";
import { OrderUpdateReasons, refundReasons } from "./CustomerConstants";
import { getCookie, setCookie } from "../../services/cookiesFunc";
import { httpVendorUpload } from "../../services/api-client";
import {
  updateOrder,
  updateRefundOrder,
} from "../../services/customerOrders/CustomerOrderService";
import toast from "react-hot-toast";

function EditExistingDeliveredOrder({
  data,
  fetching,
  open,
  setOpen,
  product,
  orderId,
  deliveredDate,
  isTmrOrder,
}) {
  const quantity = product?.quantity;
  // const [refundQty, setRefundQty] = useState(quantity);
  const [refundData, setRefundData] = useState({
    qty: quantity,
    amount: 0,
  });
  // const [returnData, setReturnData] = useState({
  //   checked: false,
  //   qty: 0,
  // });
  const [reason, setReason] = useState("");
  const [reasonDropDown, setReasonDropdown] = useState("");
  const [images, setImages] = useState([]);
  const [tmrOrderQty, setTmrOrderQty] = useState(quantity);
  const [errors, setErrors] = useState([]);
  const closeModal = () => setOpen(false);

  const resetData = () => {
    setReason("");
    setReasonDropdown("");
    setImages([]);
    setTmrOrderQty(quantity);
    setErrors([]);
  };

  const errorAmountText = `Refund amount shouldn't be greater than amount paid`;

  const handleUpload = (event, key) => {
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
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRemoveImg = (index) => {
    setImages((prev) => [
      ...images.slice(0, index),
      ...images.slice(index + 1, images.length),
    ]);
  };

  // const handleReturn = (key, value) => {
  //   setReturnData(
  //     (prev) => ({
  //       ...prev,
  //       [key]: value,
  //     }),
  //     () => {
  //       console.log({ refundData });
  //     }
  //   );
  // };

  const handleRefund = (key, value) => {
    setRefundData((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (key == "amount") {
      value > refundData?.qty * product?.offer_price
        ? setErrors((prev) => _.uniq([...prev, errorAmountText]))
        : setErrors((prev) => _.filter((prev) => prev == errorAmountText));
    }
  };

  const refundQtyOptions = Array.from(
    { length: quantity },
    (_, index) => index + 1
  );

  const totalQtyOptions = Array.from({ length: 11 }, (_, index) => index);

  const selectReasonOptions = isTmrOrder ? OrderUpdateReasons : refundReasons;

  useEffect(() => {
    setReasonDropdown(selectReasonOptions[1]);
    setTmrOrderQty(quantity);
  }, [data]);

  const refundpayload = {
    amount: Number(refundData?.amount),
    reason: `${reason}_${reasonDropDown}`,
    item_uid: Number(`${orderId}000`),
  };

  const newOrderPayload = {
    qty: Number(tmrOrderQty),
    orderitem_id: Number(product?.id),
    reason: `${reason}-${reasonDropDown}`,
  };

  const walletBalance = getCookie("walletBalance");
  const currentOrderVal = Number(getCookie("currentOrderVal"));
  const diffOrderVal = (tmrOrderQty - quantity) * product?.offer_price;
  console.log(
    { currentOrderVal, diffOrderVal },
    currentOrderVal + diffOrderVal
  );

  const presentOrderVal = currentOrderVal + diffOrderVal;
  const zeroQty = Number(tmrOrderQty) !== 0;

  // const negBalance = tmrOrderQty * product?.offer_price > Number(walletBalance);
  const negBalance = zeroQty ? presentOrderVal > Number(walletBalance) : false;
  const disableNewOrder = zeroQty
    ? negBalance || quantity == tmrOrderQty
    : false;
  const disableRefund = errors.length > 0;
  const disableBtn = isTmrOrder ? disableNewOrder : disableRefund;

  const handleSubmit = () => {
    const payload = isTmrOrder ? newOrderPayload : refundpayload;
    const api = isTmrOrder ? updateOrder : updateRefundOrder;

    if (!reason) {
      return toast.error("Please write the reason!");
    }

    api(payload)
      .then((res) => {
        toast.success("Updated Successfully!");
        console.log({ res });
        resetData();

        setCookie("currentOrderVal", presentOrderVal);
        closeModal();
      })
      .catch((err) => {
        toast.error("Update not successfully!");
        console.log({ err });
      });
  };

  console.log({ disableBtn }, quantity == tmrOrderQty, negBalance);

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
              {!isTmrOrder
                ? "Select the products and their quantities to be updated"
                : "Edit Existing Product"}
            </div>
            <ProductCard
              product={product}
              quantity={quantity}
              showQty={false}
              className='customer-shadow mt-2 p-2 rounded-md'
            >
              {!isTmrOrder ? (
                <div className='flex flex-wrap mt-1'>
                  <div className='qty'>
                    <div className='gray-color'>Qty</div>
                    <div>{product?.quantity}</div>
                  </div>
                  <div className='price text-center mx-3'>
                    <div className='gray-color'>Price</div>
                    <div className='flex space-x-2'>
                      <span>{product?.offer_price * quantity}</span>
                      <span className='line-through'>
                        {product?.selling_price * quantity}
                      </span>
                    </div>
                  </div>
                  <div className='grid grid-cols-3 place-items-center'>
                    <div className='refund-selection'>
                      <select
                        value={refundData?.qty}
                        onChange={(e) => handleRefund("qty", e.target.value)}
                        className='border border-gray-200 rounded-md p-1'
                      >
                        {refundQtyOptions?.map((x) => (
                          <option value={x}>Refund Qty {x}</option>
                        ))}
                      </select>
                    </div>

                    <div className='refund-input'>
                      <input
                        type='text'
                        placeholder='Refund amount'
                        value={refundData?.amount}
                        onChange={(e) => handleRefund("amount", e.target.value)}
                        className='border border-gray-200 rounded-md w-32 p-1 foucs:border-gray-200 focus:outline-none'
                      />
                    </div>
                    {/* <div className='return-switch m-1'>
                      Needs Return
                      <Switch
                        size='small'
                        checked={returnData?.checked}
                        onChange={() =>
                          handleReturn("checked", !returnData?.checked)
                        }
                        className='ml-5 border-2 border-gray-200'
                      />
                      <div className='return-selection border border-gray-200 rounded-md'>
                        <select
                          value={returnData?.qty}
                          onChange={(e) => handleReturn("qty", e.target.value)}
                        >
                          {refundQtyOptions?.map((x) => (
                            <option value={x}>Return Qty {x}</option>
                          ))}
                        </select>
                      </div>
                    </div> */}
                  </div>
                </div>
              ) : (
                <div className='flex items-center space-x-3'>
                  <div className='quantity-change'>
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
                      <span>{product?.offer_price * tmrOrderQty}</span>
                      <span className='line-through'>
                        {product?.selling_price * tmrOrderQty}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {errors?.map((error) => (
                <div className='text-red-400'>{error}</div>
              ))}
            </ProductCard>
            <div className='mt-5 font-medium'>Update Comments *</div>
            <div className='comment-dropdown'>
              <select
                value={reasonDropDown}
                onChange={(e) => setReasonDropdown(e.target.value)}
                placeholder={
                  isTmrOrder
                    ? "Please Select the refund Reason"
                    : "Please Select the Order Edit Reason"
                }
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
              onChange={(e) => setReason(e.target.value)}
            />
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
                  className='border-1 border-gray-300 hidden'
                  accept='image/png, image/jpeg'
                  multiple
                  id='images_upload'
                  onChange={(e) => {
                    // handleUploadFiles(e.target.files);
                    handleUpload(e, "uploadfile");
                  }}
                />

                <div className='text-sm font-medium'>
                  Upload or Drag & Drag Supporting Images *
                </div>
              </div>
            </div>
            <div className='preview-images flex space-x-3 overflow-auto'>
              {images.map((x, index) => (
                <div
                  className='relative'
                  style={{ width: "100px", height: "90px" }}
                >
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
          <div className='second-part w-[40%]'>
            <div className='roboto-500'>
              {isTmrOrder
                ? "Verify your return/refund products and amount below"
                : "Verify your final product and amount below"}
            </div>
            <ProductCard
              product={product}
              quantity={quantity}
              showQty={false}
              className='customer-shadow mt-2 p-2 rounded-md'
            >
              {!isTmrOrder ? (
                <div className='flex space-x-3 mt-1'>
                  <div className='price text-center'>
                    <div className='gray-color'>Price</div>
                    <div className='flex space-x-2'>
                      <span>{product?.offer_price * quantity}</span>
                      <span className='line-through'>
                        {product?.selling_price * quantity}
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
                  {/* <div>
                    <div className='gray-color'>Return Qty</div>
                    <div className='text-center'>{returnData?.qty}</div>
                  </div> */}
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
                      <span>{product?.offer_price * tmrOrderQty}</span>
                      <span className='line-through'>
                        {product?.selling_price * tmrOrderQty}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </ProductCard>
            <Summary
              isTmrOrder={isTmrOrder}
              currentOrderVal={currentOrderVal}
              amountPaid={quantity * product?.offer_price}
              refundAmount={refundData?.amount}
              refundTotal={quantity * product?.offer_price - refundData?.amount}
              tmrPrice={tmrOrderQty * product?.offer_price}
              tmrOrderPaid={quantity * product?.offer_price}
              tmrTotal={
                quantity * product?.offer_price -
                tmrOrderQty * product?.offer_price
              }
            />
            {negBalance && (
              <div className='text-red-500 border-2 border-gray-200 p-1 mt-2'>
                Order value is greater than Available Wallet Balance
              </div>
            )}
            <div className='submit-btn mt-5 flex justify-end'>
              <button
                className={`mt-5 w-64 text-white p-2 float-right rounded-md ${
                  disableBtn ? "bg-[#ACACAC]" : "bg-[#FB8171]"
                }`}
                disabled={disableBtn}
                onClick={handleSubmit}
              >
                Create New Order
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

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
        {amountPaid - refundAmount > 300 && (
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
