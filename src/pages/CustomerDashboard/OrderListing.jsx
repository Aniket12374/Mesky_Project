import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { previousOrdersListing } from "../../services/customerOrders/CustomerOrderService";
import { OrderTile } from "../../components/Customer/OrderListing";
import { Header } from "../../utils";

const OrderListing = () => {
    const [orders, setOrders] = useState([])
    useEffect( () => {
        previousOrdersListing().then( (res) => {
            console.log({ res })
            setOrders(res?.data?.data)
        })
    }, [])

    return (
        <Layout>
        <div>
            <Header text="Order History" />
            <div className="flex overflow-scroll">
            {orders.map( (order) => (
                 <OrderTile productName={order?.product_name} quantity={order?.quantity} />
            ))}
             </div>
        </div>
        </Layout>
    )
}

export default OrderListing