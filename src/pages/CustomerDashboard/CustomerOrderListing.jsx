import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { previousOrdersListing } from "../../services/customerOrders/CustomerOrderService";
// import { OrderTile } from "../../components/Customer/OrderListing";
import { Header } from "../../utils";
import CustomerPopup from "../../components/Common/CustomerPopup";

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
    <Layout>
      <div>
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
        <CustomerPopup
          open={modalOpen}
          closeModal={closeModal}
          modal={"order"}
        />
        {/* <div className='flex overflow-scroll'>
          {orders.map((order) => (
            <OrderTile
              productName={order?.product_name}
              quantity={order?.quantity}
            />
          ))}
        </div> */}
      </div>
    </Layout>
  );
};

export default OrderListing;
