import React, { useEffect, useState } from "react";
import { previousOrdersListing } from "../../services/customerOrders/CustomerOrderService";
import { Header } from "../../utils";
import CustomerPopup from "../../components/Common/CustomerPopup";

const OrderTile = ({ productName, quantity }) => {
  return (
    <div
      className='card flex justify-between bg-[#FB8171] rounded-lg m-2'
      style={{ minWidth: "150px" }}
    >
      <div className='text-white text-xl p-2'>{productName}</div>
      <div className='flex justify-end'>
        <div className='w-9 text-white bg-[#39a3ee] rounded-t-lg p-1'>
          x {quantity}
        </div>
      </div>
    </div>
  );
};

const OrderListing = () => {
  const [orders, setOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const closeModal = () => setModalOpen((prev) => !prev);

  useEffect(() => {
    previousOrdersListing().then((res) => {
      setOrders(res?.data?.data);
    });
  }, []);

  return (
    <div className='w-1/3'>
      <div className='flex'>
        <Header text='Order History' />
        <input
          type='text'
          onClick={() => setModalOpen(true)}
          onChange={closeModal}
          className='border-b-2 border-gray-300 w-32 ml-10 focus:outline-none'
          placeholder='Search'
        />
      </div>
      <CustomerPopup open={modalOpen} closeModal={closeModal} modal={"order"} />
      <div className='flex overflow-scroll'>
        {orders.map((order) => (
          <OrderTile
            productName={order?.product_name}
            quantity={order?.quantity}
          />
        ))}
      </div>
    </div>
  );
};

export default OrderListing;
