import React from "react";
import { ProductCard } from "../../utils";

export const OrderDetails = ({ data, closeOrderModal, address }) => {
  const { order_id, date, orderitem_info, delivery_images } = data;

  const billDetails = {
    "Sub Total": <span className='flex'>{orderitem_info?.total_price}</span>,
    MRP: orderitem_info?.total_price,
    "Product Discount": 0,
    "Returned Items": 0,
    "Delivered Charge": <span className='text-green-400'>Free</span>,
    "Grand Total": orderitem_info?.total_price,
  };

  const orderId = orderitem_info?.uid.slice(0, orderitem_info?.uid?.length - 3);

  return (
    <div className='mt-3 p-2'>
      <button
        onClick={closeOrderModal}
        className='mb-3 rounded-full border-2 border-gray-400 w-8 h-8'
      >
        <i
          className='fa fa-long-arrow-left text-sm rounded-full'
          aria-hidden='true'
        ></i>
      </button>
      <div className='order-id-delivery-address flex justify-between'>
        <div className='flex-1'>
          <div>
            Order ID : <span className='font-semibold'>{orderId}</span>
          </div>
          <div className='text-[13px]'>Delivered on {date}</div>
        </div>
        <div className='flex flex-col space-x-3 flex-1 items-end'>
          <div className='font-semibold'>Delivery Address</div>
          <div className='text-sm'>
            {address?.line_1}, {address?.line_2}
            {address?.city}
          </div>
        </div>
      </div>
      <div className='delivered-items my-5'>
        <div className='text-lg font-bold'>Delivered Items</div>
        <ProductCard
          product={orderitem_info}
          quantity={orderitem_info?.quantity}
        >
          <div></div>
        </ProductCard>
      </div>
      <div className='bill-details shadow-md p-4'>
        <div className='font-bold text-lg'>Bill Details</div>
        <div>
          {Object.keys(billDetails).map((x) => (
            <div className='flex justify-between'>
              <div>{x}</div>
              <div>{billDetails[x]}</div>
            </div>
          ))}
        </div>
      </div>
      <div className='delivery-images my-5'>
        <div className='text-lg font-semibold'>
          Images uploaded by Delivery Team
        </div>
        <div className='flex justify-center mt-2'>
          <img
            src={delivery_images?.length > 0 ? delivery_images[0] : null}
            alt='delivered-img'
            height={200}
            width={200}
          />
        </div>
      </div>
    </div>
  );
};
