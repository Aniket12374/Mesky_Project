import { useState } from "react";
import DataTable from "../Common/DataTable/DataTable";

const ListingPage = () => {
  const [selectedRowData, setSelectedRowData] = useState(null);

  const dataHistory = [
    {
      // order_date: "12-12-23",
      order_id: "iurhuyg4ryw3ttyg54",
      customer_name: "John Doedfvv",
      society_name: "DLF CREST, SECTOR 53, GURGAON-17",
      delivery: "FLAT 203, BLOCK 4, SECTION XYZ",
      align: "center",
      // product: {
      //   detail: "hgfwgerfvgc",
      // },
      agent_name: "manan",
      status: " In Progress",
    },
    {
      // order_date: "12-12-23",
      order_id: "iurhuyg4ryw3ttyg54",
      customer_name: "John Doedfvv",
      society_name: "DLF CREST, SECTOR 53, GURGAON-17",
      delivery: "FLAT 203, BLOCK 4, SECTION XYZ",
      align: "center",
      // product: {
      //   detail: "hgfwgerfvgc",
      // },
      agent_name: "manan",
      status: " Available",
    },
    {
      // order_date: "12-12-23",
      order_id: "iurhuyg4ryw3ttyg54",
      customer_name: "John Doedfvv",
      society_name: "DLF CREST, SECTOR 53, GURGAON-17",
      delivery: "FLAT 203, BLOCK 4, SECTION XYZ",
      align: "center",
      // product: {
      //   detail: "hgfwgerfvgc",
      // },
      agent_name: "manan",
      status: " Pending",
    },
  ];

  const HistoryHeaders = [
    // {
    //   title: "ORDER DATE",
    //   dataIndex: "order_date",
    //   align: "center",
    //   key: "order_date",
    //   width: 100,
    // },
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
      // width: 100,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      align: "center",
      // width: 100,
    },
  ];

  // const [isModalVisible, setIsModalVisible] = useState(false);

  // const handleSave = () => {
  //   console.log("handleSave function is called.");
  //   form
  //     .validateFields()
  //     .then((values) => {
  //       // Handle the updated values (values) here
  //       console.log("Updated values:", values);

  //       // Close the modal
  //       setIsModalVisible(false);
  //     })
  //     .catch((errorInfo) => {
  //       console.error("Validation failed:", errorInfo);
  //     });
  // };

  return (
    <div>
      <DataTable
        data={dataHistory}
        navigateTo="/products/edit/"
        columns={HistoryHeaders}
        pagination={true}
        // onRow={(record, rowIndex) => {
        //   return {
        //     onClick: () => {
        //       // Pass the clicked row's data to the showModal function
        //       showModal(record);
        //     },
        //   };
        // }}
      />
    </div>
  );
};

export default ListingPage;
