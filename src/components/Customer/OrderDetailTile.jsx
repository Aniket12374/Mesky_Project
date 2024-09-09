import React from "react";

const OrderDetailTile = ({
  productName,
  quantity,
  date,
  price,
  unitQuantity,
  orderId,
  status,
  record,
  setOrderModal,
}) => {
  const textColor =
    status === "Order Delivered"
      ? "text-[#27AE60]"
      : status !== "Paused"
      ? "text-orange"
      : "tex-red-400";

  const setOrderData = () =>
    setOrderModal((prev) => ({
      ...prev,
      open: true,
      data: record,
    }));
  return (
    <div className='card shadow-lg m-2' onClick={setOrderData}>
      <div className='card flex justify-between  rounded-lg m-2'>
        <div className='flex justify-between'>
          <div className={`border-b-2 border-gray-200 ${textColor}`}>
            {date}
          </div>
          <div className='text-[#DF4584] font-bold text-lg'>₹ {price}</div>
        </div>

        <div className='border-gray-200 border-dashed border-b-2 flex justify-between items-center px-1'>
          <div className='text-base py-1'>{productName}</div>
          <div className='text-gray-400'>
            {unitQuantity}x{quantity}
          </div>
        </div>
        <div className='py-1'> Order ID: {orderId}</div>
      </div>
    </div>
  );
};

export default OrderDetailTile;
