import React, { useEffect, useState } from "react";
import { ProductCard } from "../../utils";
import EditExistingDeliveredOrder from "./EditExistingDeliveredOrder";
import { getOrders } from "../../services/customerOrders/CustomerOrderService";

export const OrderDetails = ({ data, closeOrderModal, address }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showdropDown, setShowDropDown] = useState(false);
  const [orderData, setOrderData] = useState({});
  const [fetching, setFetching] = useState(true);
  const editModal = () => setEditModalOpen((prev) => !prev);
  const {
    date = "",
    status = "",
    orderitem_info = {},
    delivery_images = [],
  } = orderData;

  const tmrOrder = status === "ACCEPTED";

  useEffect(() => {
    setFetching(true);
    getOrders(1, 1, {
      search_value: data?.orderitem_info?.uid,
      search_type: "order_id",
    })
      .then((res) => {
        let orderDetailData = res?.data?.order_details;
        setOrderData(orderDetailData[0]);
        setFetching(false);
      })
      .catch((err) => {
        setFetching(false);
        console.log({ err });
      });
  }, [editModalOpen]);

  const handleDropDown = (e) => {
    setShowDropDown(true);
    e.stopPropagation();
  };

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
    <div className='p-2' onClick={() => setShowDropDown(false)}>
      <div className='flex justify-between'>
        <button
          onClick={closeOrderModal}
          className='rounded-full border-2 border-gray-400 w-8 h-8 flex justify-center items-center'
        >
          <i class='fa-sharp fa-solid fa-arrow-left text-2xl'></i>
        </button>
        <div className='relative'>
          <button onClick={handleDropDown}>
            <i class='fa fa-ellipsis-v ml-2 mt-3' aria-hidden='true'></i>
          </button>
          {showdropDown && (
            <div className='dropdown-options z-40 shadow-md bg-gray-300  w-full'>
              <div
                className='option p-2 hover:bg-[#FB8171] hover:text-white absolute trns-70 bg-gray-200  cursor-pointer'
                onClick={editModal}
              >
                Update Order
              </div>
            </div>
          )}
        </div>
      </div>
      {fetching ? (
        <>Loading...</>
      ) : (
        <>
          {!orderId ? (
            <div className='text-lg text-red-500 text-center'>Paused Order</div>
          ) : null}
          <div className='order-id-delivery-address flex justify-between mt-5'>
            <div className='flex-1'>
              <div className='text-[13px]'>
                <span className='font-bold gray-color'>Order ID :</span>{" "}
                <span className='font-semibold'>{orderId}</span>
              </div>
              <div className='text-[12px]'>
                {tmrOrder ? "Will be delivered" : "Delivered"} on {date}
              </div>
            </div>
            <div className='flex flex-col space-x-3 flex-1 items-end'>
              <div className='font-semibold text-sm'>Delivery Address</div>
              <div className='text-[12px] text-right'>
                {address?.line_1}, {address?.line_2}, {address?.city}
              </div>
            </div>
          </div>
          <div className='delivered-items my-5'>
            <div className='text-sm font-bold'>
              {tmrOrder ? "Items to be Delivered" : "Delivered Items"}
            </div>
            <ProductCard
              product={orderitem_info}
              quantity={orderitem_info?.quantity}
              className='mt-2 customer-shadow p-2'
            ></ProductCard>
          </div>
          <div className='bill-details customer-shadow p-4'>
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
                src={delivery_images?.length > 0 ? delivery_images[0] : null}
                alt='delivered-img'
                height={200}
                width={200}
              />
            </div>
          </div>
        </>
      )}
      <EditExistingDeliveredOrder
        data={orderData}
        fetching={fetching}
        open={editModalOpen}
        setOpen={setEditModalOpen}
        product={orderData?.orderitem_info}
        orderId={orderId}
        deliveredDate={date}
        isTmrOrder={orderData?.status === "ACCEPTED"}
      />
    </div>
  );
};
