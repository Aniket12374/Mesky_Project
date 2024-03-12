import { useQuery } from "react-query";
import DataTable from "../Common/DataTable/DataTable";
import { previousOrders } from "../../services/subscriptionOrders/subscriptionService";
import { useEffect, useState } from "react";

const ListingPage = () => {
  const { data, isLoading } = useQuery("previousOrders", previousOrders);

  let historyData = [];
  data?.data?.data.map((listingData) => {
    historyData.push({
      order_id: listingData?.order?.uid,
      customer_name: listingData?.order?.full_name,
      society_name: listingData?.society?.name,
      delivery: listingData?.order?.line_1 + " " + listingData?.order?.line_2,
      align: "center",
      agent_name: listingData?.rider?.map((x) => x.full_name + ","),
      status: listingData?.status?.del_status,
    });
  });

  const HistoryHeaders = [
    {
      title: "ORDER ID",
      dataIndex: "order_id",
      key: "order_id",
      align: "center",
      width: 100,
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customer_name",
      align: "center",
      key: "customer_name",
    },
    {
      title: "SOCIETY NAME",
      dataIndex: "society_name",
      align: "center",
      key: "society_name",
    },
    {
      title: "DELIVERY ADDRESS",
      dataIndex: "delivery",
      align: "center",
      key: "delivery",
    },
    {
      title: "AGENT NAME",
      dataIndex: "agent_name",
      key: "agent_name",
      align: "center",
      width: 200,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      align: "center",
    },
  ];

  return (
    <div>
      <DataTable
        data={historyData}
        columns={HistoryHeaders}
        pagination={true}
        loading={isLoading}
      />
    </div>
  );
};

export default ListingPage;
