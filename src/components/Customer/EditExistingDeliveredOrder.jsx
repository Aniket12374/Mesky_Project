import { Modal, Switch, Input } from "antd";
import React, { useState } from "react";
import _ from "lodash";
import { ProductCard } from "../../utils";

function EditExistingDeliveredOrder({
  data,
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
    amount: null,
  });
  // const [returnData, setReturnData] = useState({
  //   checked: false,
  //   qty: 0,
  // });
  const [reason, setReason] = useState("");
  const [images, setImages] = useState([]);
  const [Imagefiles, setImageFiles] = useState([]);
  const [tmrOrderQty, setTmrOrderQty] = useState(quantity);
  const [errors, setErrors] = useState([]);

  const handleUploadFiles = (files) => {
    setImageFiles(files);
    console.log({ files });
    console.log(URL.createObjectURL(files[0]), "files image");
    files?.map((file) => {
      const img = URL.createObjectURL(file);
      console.log({ img });
    });
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
      value > quantity * product?.offer_price
        ? setErrors((prev) =>
            _.uniq([
              ...prev,
              `refund amount shouldn't be greater than amount paid`,
            ])
          )
        : setErrors((prev) =>
            _.filter(
              (prev) =>
                prev == `refund amount shouldn't be greater than amount paid`
            )
          );
    }
  };

  const refundQtyOptions = Array.from(
    { length: quantity },
    (_, index) => index + 1
  );

  const totalQtyOptions = Array.from({ length: 10 }, (_, index) => index + 1);

  const closeModal = () => setOpen(false);
  return (
    <div>
      <Modal
        open={open}
        onCancel={closeModal}
        width={1200}
        className='roboto-400'
      >
        <div className='flex space-x-5'>
          <div className='w-[60%]'>
            <div>
              <span className='font-bold gray-color text-sm'>Order ID: </span>
              <span className='font-medium'>{orderId}</span>
            </div>
            <div className='text-xs font-bold'>
              <span className='gray-color'>Delivery Date: </span>
              <span>{deliveredDate}</span>
            </div>
            <div className='mt-3 font-medium'>
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
                        // onChange={(e) => setRefundQty(e.target.value)}
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
                        <option value={qtyOption}> Qty {qtyOption}</option>
                      ))}
                    </select>
                  </div>
                  <div className='price text-center mx-2'>
                    <div className='gray-color'>Price</div>
                    <div className='flex space-x-2'>
                      <span>{product?.offer_price}</span>
                      <span className='line-through'>
                        {product?.selling_price}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {errors?.map((error) => (
                <div className='text-red-400'>{error}</div>
              ))}
            </ProductCard>
            <div className='mt-3 font-medium'>Update Comments *</div>
            <div className='comment-dropdown'></div>
            <Input
              type='text'
              value={reason}
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
                  onChange={(e) => handleUploadFiles(e.target.files)}
                />

                <div className='text-sm font-medium'>
                  Upload or Drag & Drag Supporting Images *
                </div>
              </div>
            </div>
            <div className='preview-images'></div>
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
          </div>
        </div>
      </Modal>
    </div>
  );
}

const Summary = ({
  isTmrOrder,
  amountPaid,
  refundAmount,
  tmrPrice,
  tmrOrderPaid,
}) => {
  const refundOrderData = {
    "Amount Paid": amountPaid,
    "Refund Amount": refundAmount,
    "Refund Total": amountPaid - refundAmount,
  };
  const newOrderData = {
    "Total Price": tmrPrice,
    "Already Deducted": tmrOrderPaid,
    "To be Paid": tmrOrderPaid - tmrPrice,
  };

  const refundSummary = {
    "Total Refund": amountPaid - refundAmount,
    "Grand Total": "",
  };

  const newOrderSummary = {
    "Current Wallet Balance": "wallet balance",
    "To Deduct from Wallet": tmrOrderPaid - tmrPrice,
  };
  const summaryObj = isTmrOrder ? newOrderData : refundOrderData;
  const summaryTotal = isTmrOrder ? newOrderSummary : refundSummary;
  return (
    <React.Fragment>
      <div className='p-2 customer-shadow my-5 roboto-400'>
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
      <div className='order-summary customer-shadow p-2 mb-5'>
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
