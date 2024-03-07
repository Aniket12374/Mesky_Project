import React, { useEffect } from "react";
import { useQuery } from "react-query";
import DataTable from "../../Common/DataTable/DataTable";
import OrderHeaders from "../OrderHeaders";
import { fetchCancelledOrders } from "../../../services/order/orderService";

const CancelledListingTab = () => {
  const { data, isLoading } = useQuery({
    queryKey: [`CancelledOrders`],
    queryFn: () => fetchCancelledOrders(0, 100),
  });

  const colData = data?.data?.data;
  const names = new Set();
  const { headers } = OrderHeaders("Cancelled", {}, names);

  useEffect(() => {
    names.clear();
  });

  return (
    <DataTable
      data={colData}
      // navigateTo="/cancelled/order/view/"
      columns={headers(colData)}
      // pagination={true}
      scroll={{ y: 400 }}
      loading={isLoading}
    />
  );
};

export default CancelledListingTab;
