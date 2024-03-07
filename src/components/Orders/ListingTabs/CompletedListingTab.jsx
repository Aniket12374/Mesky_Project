import React from "react";
import { useQuery } from "react-query";
import DataTable from "../../Common/DataTable/DataTable";
import OrderHeaders from "../OrderHeaders";
import { fetchCompletedOrders } from "../../../services/order/orderService";
import { useEffect } from "react";

const CompletedListingTab = () => {
  const { data, isLoading } = useQuery({
    queryKey: [`CompletedOrders`],
    queryFn: () => fetchCompletedOrders(0, 100),
  });

  const colData = data?.data?.data;
  const names = new Set();

  useEffect(() => {
    names.clear();
  });

  const { headers } = OrderHeaders("Completed", {}, names);

  return (
    <DataTable
      data={colData}
      // navigateTo="/completed/order/view/"
      columns={headers(colData)}
      // pagination={true}
      scroll={{ y: 400 }}
      loading={isLoading}
    />
  );
};

export default CompletedListingTab;
