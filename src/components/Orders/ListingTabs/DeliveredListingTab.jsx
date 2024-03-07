import React, { useEffect } from "react";
import { useQuery } from "react-query";
import DataTable from "../../Common/DataTable/DataTable";
import OrderHeaders from "../OrderHeaders";
import { fetchDeliveredOrders } from "../../../services/order/orderService";

const DeliveredListingTab = () => {
  const { data, isLoading } = useQuery({
    queryKey: [`DeliveredOrders`],
    queryFn: () => fetchDeliveredOrders(0, 100),
  });

  const colData = data?.data?.data;
  const names = new Set();
  const { headers } = OrderHeaders("Delivered", {}, names);

  useEffect(() => {
    names.clear();
  });

  return (
    <DataTable
      data={colData}
      // navigateTo="/delivered/order/view/"
      columns={headers(colData)}
      // pagination={true}
      scroll={{ y: 400 }}
      loading={isLoading}
    />
  );
};

export default DeliveredListingTab;
