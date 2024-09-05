import React from "react";
import { ProductCard } from "../../utils";

export const OrderDetails = ({ data }) => {
  const { order_id, date, orderitem_info, delivery_images } = data;

  const billDetails = {
    "Sub Total": (
      <span className='flex'>
        {orderitem_info?.total_price}
        {/* <span className='ml-2 line-through'>
          {orderitem_info?.selling_price * orderitem_info?.quantity}
        </span> */}
      </span>
    ),
    MRP: orderitem_info?.total_price,
    "Product Discount": 0,
    "Returned Items": 0,
    "Delivered Charge": <span className='text-green-400'>Free</span>,
    "Grand Total": orderitem_info?.total_price,
  };

  return (
    <div className='mt-10'>
      <div className='order-id-delivery-address flex justify-between'>
        <div className='flex-1'>
          <div>
            Order ID : <span className='font-semibold'>{order_id}</span>
          </div>
          <div className='text-[13px]'>Delivered on {date}</div>
        </div>
        <div className='flex flex-col flex-1 items-end'>
          <div className='font-semibold'>Delivery Address</div>
          <div>ajkgjkskg</div>
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
