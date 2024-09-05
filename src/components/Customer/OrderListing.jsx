import React, { useEffect, useState } from "react";
import {
  getOrders,
  previousOrdersListing,
} from "../../services/customerOrders/CustomerOrderService";
import { Header } from "../../utils";
import CustomerPopup from "../../components/Common/CustomerPopup";
import { OrderDetails } from "./OrderDetails";
import { Modal } from "antd";

const OrderTile = ({
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

const OrderListing = () => {
  const [orders, setOrders] = useState([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [orderModal, setOrderModal] = useState({
    open: false,
    data: {},
  });

  const closeModal = () => setFilterModalOpen((prev) => !prev);
  const closeOrderModal = () =>
    setOrderModal((prev) => ({
      ...prev,
      open: !prev?.open,
    }));

  useEffect(() => {
    getOrders().then((res) => {
      console.log({ res }, res?.data?.order_details);
      setOrders(res?.data?.order_details);
    });
  }, []);

  return (
    <div className='w-1/3 border-2 border-gray-200'>
      <div className='flex'>
        <Header text='Order History' className='m-2' />
        <input
          type='text'
          onClick={() => setFilterModalOpen(true)}
          onChange={closeModal}
          className='border-b-2 border-gray-300 w-32 ml-10 focus:outline-none'
          placeholder='Search'
        />
      </div>
      <CustomerPopup
        open={filterModalOpen}
        closeModal={closeModal}
        modal={"order"}
      />
      <div className=''>
        {orders.map((order) => (
          <OrderTile
            productName={order?.orderitem_info?.product_sn}
            quantity={order?.orderitem_info?.quantity}
            date={order?.date}
            price={order?.total_price}
            unitQuantity={order?.orderitem_info?.dprod_unit_qty}
            orderId={order?.order_id}
            status={order?.status}
            record={order}
            setOrderModal={setOrderModal}
          />
        ))}
      </div>
      <Modal
        style={{ fontFamily: "Fredoka, sans-serif" }}
        open={orderModal?.open}
        onOk={closeOrderModal}
        onCancel={closeOrderModal}
      >
        <OrderDetails data={orderModal?.data} setTransactionId={null} />
      </Modal>
    </div>
  );
};

export default OrderListing;
