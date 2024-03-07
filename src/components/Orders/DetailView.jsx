import React, { useState, useEffect } from "react";
import { FormInput, FormTextArea } from "../Product/Form/FormComponents";
import { useForm } from "react-hook-form";
import Layout from "../Layout/Layout";
import DataTable from "../Common/DataTable/DataTable";
import { useLocation } from "react-router-dom";
import OrderHeaders from "./OrderHeaders";
import { Modal } from "antd";
import CancellingFlow from "./CancellingFlow";
import { fetchOrderItemDetails } from "../../services/order/orderService";
import { Header } from "../../utils";

const DetailView = () => {
  const { register, control, setValue } = useForm();
  const [orderDetails, setOrderDetails] = useState({});

  let location = useLocation();
  const locationSplit = location.pathname.split("/");
  const tabName = locationSplit[1];
  const tab = tabName.charAt(0).toLocaleUpperCase() + tabName.slice(1);
  const names = new Set();

  useEffect(() => {
    const orderId = location.pathname.split("/").pop();
    fetchOrderItemDetails(orderId).then((res) => {
      setOrderDetails(res);
      setValue("shippingAddress", res["address"]);
    });
    names.clear();
  }, []);

  const {
    headers,
    buttons,
    isDispatchedModalOpen,
    isCancellationModalOpen,
    setDispatchedModalOpen,
    setCancellationModalOpen,
    handleDispatchOk,
  } = OrderHeaders(tab, orderDetails, names);

  return (
    <Layout>
      <div className="order-detail-view-table">
        <Header text={`Order ID: ${orderDetails.uid}`} />
        {orderDetails && (
          <DataTable
            data={[orderDetails]}
            columns={headers([orderDetails])}
            scroll={{ y: 400 }}
          />
        )}
      </div>
      <div className="order-detail-view mx-10 h-96 overflow-auto">
        <div className="flex space-x-5 mt-10">
          <div className="flex flex-col space-y-5 w-full">
            <FormInput
              name="customerName"
              label="Customer Name"
              register={register}
              value={orderDetails.customer_email}
            />
            <FormInput
              name="customerEmail"
              label="Customer Email"
              register={register}
              value={orderDetails.customer_email}
            />
            <FormInput
              name="customerNumber"
              label="Customer Number"
              register={register}
              value={orderDetails.customer_mobile}
            />
            <div>
              <FormTextArea
                label="Shipping to Address"
                name="shippingAddress"
                autoSize={{
                  minRows: 2,
                  maxRows: 2,
                }}
                control={control}
              />
            </div>
            <div className="">
              <FormTextArea
                label="Notes"
                name="notes"
                required
                autoSize={{
                  minRows: 2,
                  maxRows: 2,
                }}
                defaultValue=""
                control={control}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-5 w-full">
            <FormInput
              register={register}
              name="orderStatus"
              label="Order Status"
              value={tab}
            />
            {tab === "Cancelled" ? null : (
              <FormInput
                name="shippingStatus"
                label="Shipping Status"
                register={register}
                className="mt-5"
                value={orderDetails.delivery_status}
              />
            )}

            {tab == "Cancelled" || tab == "Delivered" ? null : (
              <FormInput
                label="Last Action"
                name="lastAction"
                className="mt-5"
                required
                register={register}
              />
            )}
            <FormInput
              name="waybill"
              label="Way Bill"
              register={register}
              className="mt-5"
              value={orderDetails.waybill_number}
            />
            <FormInput
              name="pickupTime"
              label="Pickup Date & Time"
              className="mt-5"
              register={register}
              value={
                orderDetails.pickup_request_date
                  ? orderDetails.pickup_request_date
                  : "pickup scheduled at"
              }
            />
          </div>
        </div>

        <div className="order-detailview-btns text-center mt-5">
          {Object.keys(orderDetails).length > 1 &&
            buttons.map((btn, index) => <span key={index}>{btn}</span>)}
        </div>
      </div>
      <Modal
        title=""
        centered
        open={isDispatchedModalOpen}
        onOk={handleDispatchOk}
        onCancel={() => setDispatchedModalOpen(false)}
      >
        <p>Order is Dispatched</p>
      </Modal>
      <CancellingFlow
        isOpen={isCancellationModalOpen}
        setIsOpen={setCancellationModalOpen}
        orderDetails={orderDetails}
      />
    </Layout>
  );
};

export default DetailView;
