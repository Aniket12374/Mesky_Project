import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Modal, Table } from "antd";
import DataTable from "../../Common/DataTable/DataTable";
import OrderHeaders from "../OrderHeaders";
import CancellingFlow from "../CancellingFlow";
import { fetchOpenOrders } from "../../../services/order/orderService";

const OpenListingTab = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const names = new Set();
  const {
    headers,
    isDispatchedModalOpen,
    setDispatchedModalOpen,
    handleDispatchOk,
    isCancellationModalOpen,
    setCancellationModalOpen,
    cancellationOrderData,
  } = OrderHeaders("Open", {}, names);

  useEffect(() => {
    names.clear();
  });

  useEffect(() => {
    setLoading(true);
    fetchOpenOrders(0, 100)
      .then((res) => {
        setLoading(false);
        const colData = res.data?.data
          .sort((x, y) => x.order_uid - y.order_uid)
          .filter((x) => x.delivery_status === "PICKUP SCHEDULED");

        colData &&
          colData.map((x, index) => {
            x["key"] = index;
          });

        setData(colData);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [isDispatchedModalOpen, isCancellationModalOpen]);

  return (
    <div className="product-listing-page">
      <DataTable
        dataSource={data}
        // navigateTo="/open/order/view/"
        columns={headers(data, names)}
        // pagination={true}
        scroll={{ y: 400 }}
        loading={loading}
        rowClassName="h-24"
        // bordered
      />
      <Modal
        title=""
        centered
        open={isDispatchedModalOpen}
        onOk={handleDispatchOk}
        onCancel={() => setDispatchedModalOpen(false)}
      >
        <p>Has the delivery patner picked up the package?</p>
      </Modal>
      <CancellingFlow
        isOpen={isCancellationModalOpen}
        setIsOpen={setCancellationModalOpen}
        orderDetails={cancellationOrderData}
      />
    </div>
  );
};

export default OpenListingTab;
