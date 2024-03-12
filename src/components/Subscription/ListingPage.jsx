import React from "react";
import DataTable from "../Common/DataTable/DataTable";
import { useQuery } from "react-query";
import {
  presentOrders,
  previousOrders,
} from "../../services/subscriptionOrders/subscriptionService";

const ListingPage = () => {
  const [selectedRowData, setSelectedRowData] = React.useState(null);
  // const { data, isLoading } = useQuery("presentOrders", presentOrders);
  const { data, isLoading } = useQuery("presentOrders", previousOrders);

  let historyData = [];
  data?.data?.data.map((listingData) => {
    historyData.push({
      order_id: listingData?.order?.uid,
      customer_name: listingData?.order?.full_name,
      society_name: listingData?.society?.name,
      delivery: listingData?.order?.line_1 + " " + listingData?.order?.line_2,
      align: "center",
      agent_name: listingData?.rider?.name,
      status: listingData?.status?.name,
    });
  });

  const dataHistory = [
    {
      order_id: "iurhuyg4ryw3ttyg54",
      customer_name: "John Doedfvv",
      society_name: "DLF CREST, SECTOR 53, GURGAON-17",
      delivery: "FLAT 203, BLOCK 4, SECTION XYZ",
      align: "center",
      agent_name: "manan",
      status: " In Progress",
    },
    {
      order_id: "iurhuyg4ryw3ttyg54",
      customer_name: "John Doedfvv",
      society_name: "DLF CREST, SECTOR 53, GURGAON-17",
      delivery: "FLAT 203, BLOCK 4, SECTION XYZ",
      align: "center",
      agent_name: "manan",
      status: " Available",
    },
    {
      order_id: "iurhuyg4ryw3ttyg54",
      customer_name: "John Doedfvv",
      society_name: "DLF CREST, SECTOR 53, GURGAON-17",
      delivery: "FLAT 203, BLOCK 4, SECTION XYZ",
      align: "center",
      agent_name: "manan",
      status: " Pending",
    },
  ];

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
        // navigateTo="/products/edit/"
        loading={isLoading}
        columns={HistoryHeaders}
        pagination={true}
        // onRow={(record, rowIndex) => {
        //   return {
        //     onClick: () => {
        //       setSelectedRowData(record);
        //     },
        //   };
        // }}
      />
    </div>
  );
};

export default ListingPage;
