import React from "react";
import { ProductCard } from "../../utils";

export const OrderDetails = ({ data, closeOrderModal, address }) => {
  const { order_id, date, orderitem_info, delivery_images = [] } = data;

  const billDetails = {
    "Sub Total": <span className='flex'>₹ {orderitem_info?.total_price}</span>,
    MRP: orderitem_info?.total_price,
    "Product Discount": `₹ 0`,
    "Returned Items": `₹ 0`,
    "Delivered Charge": <span className='text-[#12c412]'>Free</span>,
    "Grand Total": (
      <div className='font-semibold text-sm my-2'>
        ₹ {orderitem_info?.total_price}
      </div>
    ),
  };

  const orderId = orderitem_info?.uid?.slice(
    0,
    orderitem_info?.uid?.length - 3
  );

  const billKeys = Object.keys(billDetails);

  return (
    <div className='mt-3 p-2'>
      <button
        onClick={closeOrderModal}
        className='rounded-full border-2 border-gray-400 w-8 h-8 flex justify-center items-center'
      >
        <i class='fa-sharp fa-solid fa-arrow-left text-2xl'></i>
      </button>
      {!orderId ? (
        <div className='text-lg text-red-500 text-center'>Paused Order</div>
      ) : null}
      <div className='order-id-delivery-address flex justify-between mt-5'>
        <div className='flex-1'>
          <div className='text-[13px]'>
            <span className='font-bold gray-color'>Order ID :</span>{" "}
            <span className='font-semibold'>{orderId}</span>
          </div>
          <div className='text-[12px]'>Delivered on {date}</div>
        </div>
        <div className='flex flex-col space-x-3 flex-1 items-end'>
          <div className='font-semibold text-sm'>Delivery Address</div>
          <div className='text-[12px] text-right'>
            {address?.line_1}, {address?.line_2}, {address?.city}
          </div>
        </div>
      </div>
      <div className='delivered-items my-5'>
        <div className='text-sm font-bold'>Delivered Items</div>
        <ProductCard
          product={orderitem_info}
          quantity={orderitem_info?.quantity}
        >
          <div></div>
        </ProductCard>
      </div>
      <div className='bill-details shadow-md p-4'>
        <div className='font-bold text-sm'>Bill Details</div>
        <div className='mt-2 text-sm'>
          {billKeys.map((x, index) => (
            <div className='flex justify-between my-1'>
              <div
                className={`${
                  index == 1 || index == 2 ? "text-gray-400" : ""
                } ${
                  index == 0 || index == billKeys.length - 1
                    ? "font-semibold my-2"
                    : ""
                }`}
              >
                {x}
              </div>
              <div>{billDetails[x]}</div>
            </div>
          ))}
        </div>
      </div>
      <div className='delivery-images my-5'>
        <div className='text-sm font-semibold'>
          Images uploaded by Delivery Team
        </div>
        <div className='flex justify-center mt-2'>
          <img
            src={delivery_images.length > 0 ? delivery_images[0] : null}
            alt='delivered-img'
            height={200}
            width={200}
          />
        </div>
      </div>
    </div>
  );
};
