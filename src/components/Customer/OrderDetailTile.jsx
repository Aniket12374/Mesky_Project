import React from "react";
import moment from "moment";

const OrderDetailTile = ({
  record,
  index,
  setOrderModal,
  setFilterModalOpen,
}) => {
  const { orderitem_info, status, date, refund_misc } = record;
  const {
    uid,
    unit_price,
    offer_price,
    dprod_unit_qty,
    product_sn,
    quantity,
    modified_date,
  } = orderitem_info;
  const prodOddPrice = unit_price || offer_price;
  const unitQuantity = dprod_unit_qty;
  const orderedPrice = prodOddPrice * quantity;
  const refundedPrice = refund_misc?.refund_amount || 0;
  const finalOrderPrice = orderedPrice - refundedPrice;
  const orderUid = uid?.slice(0, uid.length - 3);

  const textColor = status !== "ACCEPTED" ? "text-[#27AE60]" : "text-red-400";

  const setOrderData = () => {
    setFilterModalOpen(false);
    setOrderModal((prev) => ({
      ...prev,
      open: true,
      data: record,
    }));
  };

  const dateArr = date?.replace(" GMT", "").split(" ");
  let finalDate = "";
  if (dateArr) {
    let time = dateArr ? dateArr[dateArr?.length - 1] : [];
    dateArr.pop();
    let timeArr = time.split(":");
    if (timeArr[0] > 12) timeArr[0] = timeArr[0] - 12;
    time = timeArr.reduce((acc, cur) => acc + ":" + cur);
    const final = dateArr.reduce((acc, cur) => acc + " " + cur);
    finalDate = final + " " + time;
  }

  return (
    <div
      className='rounded-md shadow-md m-2'
      onClick={setOrderData}
      key={index}
    >
      <div className='card flex justify-between  m-2'>
        <div className='flex justify-between items-center'>
          <div className={`border-b-2 border-gray-200 text-xs ${textColor}`}>
            {status === "ACCEPTED"
              ? "To be delivered today/tomorrow between 5 to 8 am"
              : `Delivered on ${finalDate}`}
          </div>
          <div className='text-[#DF4584] font-bold text-lg'>
            ₹ {finalOrderPrice}
          </div>
        </div>

        <div className='border-gray-200 border-dashed border-b-2 flex justify-between items-center px-1'>
          <div className='text-sm py-1'>{product_sn}</div>
          <div className='text-gray-400 text-xs'>
            {unitQuantity}x{quantity}
          </div>
        </div>
        <div className='py-1 text-xs'>
          <span className='font-bold gray-color'>Order ID:</span>
          <span className='font-bold ml-1'>{orderUid}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailTile;
