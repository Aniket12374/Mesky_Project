import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { Modal, Table } from "antd";
import DataTable from "../../Common/DataTable/DataTable";
import OrderHeaders from "../OrderHeaders";
import CancellingFlow from "../CancellingFlow";
import { fetchOpenOrders } from "../../../services/order/orderService";

const InTransitTab = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [`OpenOrders`],
    queryFn: () => fetchOpenOrders(0, 100),
    staleTime: 120000,
    cacheTime: 120000,
  });

  const colData = data?.data?.data.filter(
    (x) => x.delivery_status === "PICKED UP"
  );

  colData &&
    colData.map((x, index) => {
      x["key"] = index;
    });

  const names = new Set();

  useEffect(() => {
    names.clear();
  });

  const {
    headers,
    isDispatchedModalOpen,
    setDispatchedModalOpen,
    handleDispatchOk,
    isCancellationModalOpen,
    setCancellationModalOpen,
    cancellationOrderData,
  } = OrderHeaders("Open", {}, names);

  return (
    <div className="product-listing-page">
      <DataTable
        dataSource={colData}
        columns={headers(colData, names)}
        scroll={{ y: 400 }}
        loading={isLoading}
        rowClassName="h-24"
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

export default InTransitTab;
