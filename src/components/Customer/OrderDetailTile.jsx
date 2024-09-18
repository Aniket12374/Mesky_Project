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
  setFilterModalOpen,
}) => {
  const textColor =
    status === "Order Delivered"
      ? "text-[#27AE60]"
      : status !== "Paused"
      ? "text-[#FB8171]"
      : "tex-red-400";

  const setOrderData = () => {
    setFilterModalOpen(false);
    setOrderModal((prev) => ({
      ...prev,
      open: true,
      data: record,
    }));
  };

  const dateArr = date.replace(" GMT", "").split(" ");
  let time = dateArr[dateArr.length - 1];
  dateArr.pop();
  let timeArr = time.split(":");
  if (timeArr[0] > 12) timeArr[0] = timeArr[0] - 12;
  time = timeArr.reduce((acc, cur) => acc + ":" + cur);
  const final = dateArr.reduce((acc, cur) => acc + " " + cur);
  const finalDate = final + " " + time;

  return (
    <div className='rounded-md shadow-md m-2' onClick={setOrderData}>
      <div className='card flex justify-between  m-2'>
        <div className='flex justify-between items-center'>
          <div className={`border-b-2 border-gray-200 text-xs ${textColor}`}>
            {status === "ACCEPTED"
              ? "To be delivered today/tomorrow between 5 to 8 am"
              : `Delivered on ${finalDate}`}
          </div>
          <div className='text-[#DF4584] font-bold text-lg'>₹ {price}</div>
        </div>

        <div className='border-gray-200 border-dashed border-b-2 flex justify-between items-center px-1'>
          <div className='text-sm py-1'>{productName}</div>
          <div className='text-gray-400 text-xs'>
            {unitQuantity}x{quantity}
          </div>
        </div>
        <div className='py-1 text-xs'>
          <span className='font-bold gray-color'>Order ID:</span>
          <span className='font-bold ml-1'>{orderId}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailTile;
