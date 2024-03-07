import React from "react";
import { useQuery } from "react-query";
import DataTable from "../../Common/DataTable/DataTable";
import { fetchAllOrders } from "../../../services/order/orderService";
import OrderHeaders from "../OrderHeaders";
import { useEffect } from "react";

const AllOrdersListingTab = () => {
  const { data, isLoading } = useQuery({
    queryKey: [`AllOrders`],
    queryFn: () => fetchAllOrders(0, 500),
  });

  const colData = data?.data?.data;

  const names = new Set();
  useEffect(() => {
    names.clear();
  });

  const sorted1 = colData && colData.sort((x, y) => x.order_uid - y.order_uid);
  const { headers } = OrderHeaders("All", {}, names);

  return (
    <DataTable
      data={sorted1}
      // navigateTo="/all/order/view/"
      columns={headers(sorted1)}
      // pagination={true}
      scroll={{ y: 400 }}
      loading={isLoading}
    />
  );
};

export default AllOrdersListingTab;
