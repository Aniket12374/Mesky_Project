import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { Modal } from "antd";
import DataTable from "../../Common/DataTable/DataTable";
import OrderHeaders from "../OrderHeaders";
import { fetchReturnedOrders } from "../../../services/order/orderService";

const ReturnedListingTab = () => {
  const { data, isLoading } = useQuery({
    queryKey: [`ReturnedOrders`],
    queryFn: () => fetchReturnedOrders(0, 100),
  });

  const colData = data?.data?.data;
  const names = new Set();

  useEffect(() => {
    names.clear();
  });

  const { headers, isReturnedModalOpen, setReturnedModalOpen, handleReturnOk } =
    OrderHeaders("Returns", {}, names);

  return (
    <>
      <DataTable
        data={colData}
        // navigateTo="/returns/order/view/"
        columns={headers(colData)}
        // pagination={true}
        scroll={{ y: 400 }}
        loading={isLoading}
      />
      <Modal
        title=""
        centered
        open={isReturnedModalOpen}
        onOk={handleReturnOk}
        onCancel={() => setReturnedModalOpen(false)}
      >
        <p>Order Returned Successfully</p>
      </Modal>
    </>
  );
};

export default ReturnedListingTab;
