import React, { useEffect, useState } from "react";
import { dateModified, ProductCard } from "../../utils";
import EditExistingDeliveredOrder from "./EditExistingDeliveredOrder";
import { getOrders } from "../../services/customerOrders/CustomerOrderService";
import { useQuery } from "react-query";

export const OrderDetails = ({ closeOrderModal, orderDataUid }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showdropDown, setShowDropDown] = useState(false);

  const editModal = () => setEditModalOpen((prev) => !prev);

  const getOrderUid = (uid) => {
    return getOrders(1, 1, {
      search_value: uid,
      search_type: "order_id",
    }).then((res) => {
      const orderDetailData = res?.data?.order_details;
      const successOrderData = orderDetailData.find((x) => x.status);
      return successOrderData;
    });
  };

  const {
    isFetching,
    refetch: refetchOrderUid,
    data: OrderUIDData,
    isSuccess,
  } = useQuery({
    queryKey: ["order_uid", orderDataUid],
    queryFn: () => getOrderUid(orderDataUid),
    staleTime: 30000,
  });

  const {
    date = "",
    status = "",
    orderitem_info: orderInfo = {},
    delivery_images: delImages = [],
    misc = {},
    refund_misc = {},
    address = {},
  } = OrderUIDData || {};

  const isTmrOrder = status === "ACCEPTED";
  const isRefundOrder = status.toLowerCase().includes("refund");
  // const orderUid = orderInfo?.uid;

  const handleDropDown = (e) => {
    setShowDropDown(true);
    e.stopPropagation();
  };

  const subTotalHeading = `Sub Total (${orderInfo?.quantity} Items)`;
  const refundQtyHeading = `Refunded Items (${
    refund_misc?.refund_qty || orderInfo?.quantity
  }Qty)`;

  const totalPriceOrdered =
    orderInfo?.quantity * (orderInfo?.unit_price || orderInfo?.offer_price);

  const refundAmount = refund_misc?.refund_amount || 0;

  const billDetails = {
    [subTotalHeading]: <span className='flex'>₹ {totalPriceOrdered}</span>,
    MRP: `₹ ${orderInfo?.total_price}`,
    "Product Discount": `₹ 0`,
    ...(isRefundOrder && {
      [refundQtyHeading]: <span> ₹ {refundAmount}</span>,
    }),
    "Delivered Charge": <span className='text-[#12c412]'>Free</span>,
    "Grand Total": (
      <div className='font-semibold text-sm my-2'>
        ₹ {totalPriceOrdered - refundAmount}
      </div>
    ),
  };

  const orderId = orderDataUid?.slice(0, orderDataUid?.length - 3);
  const billKeys = Object.keys(billDetails);

  return (
    <div className='p-2' onClick={() => setShowDropDown(false)}>
      <div className='flex justify-between'>
        <button
          onClick={closeOrderModal}
          className='rounded-full border-2 border-gray-400 w-8 h-8 flex justify-center items-center'
        >
          <i className='fa-sharp fa-solid fa-arrow-left text-2xl'></i>
        </button>
        {!isRefundOrder && (
          <div className='relative'>
            <button onClick={handleDropDown}>
              <i className='fa fa-ellipsis-v ml-2 mt-3' aria-hidden='true'></i>
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
        )}
      </div>
      {isFetching ? (
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
                {isTmrOrder ? "Will be delivered" : "Delivered"} on{" "}
                {dateModified(date)}
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
              {isTmrOrder ? "Items to be Delivered" : "Delivered Items"}
            </div>
            <ProductCard
              product={orderInfo}
              offPrice={orderInfo.unit_price || orderInfo.offer_price}
              quantity={orderInfo?.quantity}
              className='mt-2 customer-shadow p-2'
            ></ProductCard>
          </div>
          <div className='bill-details customer-shadow p-4'>
            <div className='font-bold text-sm'>Bill Details</div>
            <div className='mt-2 text-sm'>
              {billKeys.map((x, index) => (
                <div className='flex justify-between my-1 items-center'>
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
          {!isTmrOrder && (
            <div className='delivery-images my-5'>
              <div className='text-sm font-semibold'>
                Images uploaded by Delivery Team
              </div>
              <div className='flex justify-center mt-2'>
                <img
                  src={delImages?.length > 0 ? delImages[0] : null}
                  alt='delivered-img'
                  height={200}
                  width={200}
                />
              </div>
            </div>
          )}
        </>
      )}
      <EditExistingDeliveredOrder
        data={OrderUIDData}
        fetching={isFetching}
        open={editModalOpen}
        setOpen={setEditModalOpen}
        product={orderInfo}
        orderId={orderId}
        deliveredDate={date}
        isTmrOrder={isTmrOrder}
        isRefundOrder={isRefundOrder}
        refetchOrderUid={refetchOrderUid}
      />
    </div>
  );
};
