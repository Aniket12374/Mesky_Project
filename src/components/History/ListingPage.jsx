import React, { useState } from "react";
import { useQuery } from "react-query";
import DataTable from "../Common/DataTable/DataTable";
import { previousOrders } from "../../services/subscriptionOrders/subscriptionService";
import { useNavigate } from "react-router-dom";

const ListingPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useQuery(
    ["previousOrders", currentPage],
    () => previousOrders(currentPage)
  );

  if (isError) {
    return navigate("/login");
  }

  const uniqueSocietyNames = Array.from(
    new Set(data?.data?.data.map((listingData) => listingData?.society?.name))
  );
  const uniqueAgentNames = Array.from(
    new Set(
      data?.data?.data.flatMap((listingData) =>
        listingData?.rider?.map((rider) => rider.full_name)
      )
    )
  );
  const uniqueStatuses = Array.from(
    new Set(
      data?.data?.data.map((listingData) => listingData?.status?.del_status)
    )
  );

  let historyData = [];
  data?.data?.data.map((listingData) => {
    const ridersCount = listingData?.rider?.length;
    historyData.push({
      order_id: listingData?.order?.uid,
      customer_name: listingData?.order?.full_name,
      society_name: listingData?.society?.name,
      delivery: listingData?.order?.line_1 + " " + listingData?.order?.line_2,
      // align: "center",
      agent_name: listingData?.rider?.map((rider, key) => {
        let comma = ridersCount - 1 !== key ? ", " : "";
        return rider.full_name + comma;
      }),
      status: listingData?.status?.status || "In Transit", // Defaulting to "In Transit" if no status available
    });
  });

  const HistoryHeaders = [
    {
      title: "ORDER ID",
      dataIndex: "order_id",
      key: "order_id",
      width: 100,
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customer_name",
      key: "customer_name",
    },
    {
      title: "SOCIETY NAME",
      dataIndex: "society_name",
      key: "society_name",
      filters: uniqueSocietyNames.map((societyName) => ({
        text: societyName,
        value: societyName,
      })),
      onFilter: (value, record) => record.society_name === value,
    },
    {
      title: "DELIVERY ADDRESS",
      dataIndex: "delivery",
      key: "delivery",
    },
    {
      title: "AGENT NAME",
      dataIndex: "agent_name",
      key: "agent_name",
      filters: uniqueAgentNames.map((agentName) => ({
        text: agentName,
        value: agentName,
      })),
      onFilter: (value, record) => record.agent_name.includes(value),
      width: 200,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      filters: uniqueStatuses.map((status) => ({
        text: status,
        value: status,
      })),
      onFilter: (value, record) => record.status === value,
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginationConfig = {
    current: currentPage,
    pageSize: 10,
    total: data?.data?.totalCount,
    onChange: handlePageChange,
  };

  return (
    <div>
      <DataTable
        data={historyData}
        columns={HistoryHeaders}
        pagination={paginationConfig}
        loading={isLoading}
      />
    </div>
  );
};

export default ListingPage;
