import { useState } from "react";
import DataTable from "../Common/DataTable/DataTable";

const AgentDetail = () => {
  const dataHistory = [
    {
      order_date: "12-12-23",
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
      image_log: " In Progress",
    },
    {
      order_date: "12-12-23",
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
      image_log: " In Progress",
    },
    {
      order_date: "12-12-23",
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
      image_log: " In Progress",
    },
  ];

  const HistoryHeaders = [
    {
      title: "ORDER DATE",
      dataIndex: "order_date",
      align: "center",
      key: "order_date",
      //   width: 100,
    },
    {
      title: "ORDER ID",
      dataIndex: "order_id",
      key: "order_id",
      align: "center",
      //   width: 100,
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
      //   width: 50,
    },

    {
      title: "DELIVERY ADDRESS",
      dataIndex: "delivery",
      align: "center",
      key: "delivery",
      //   width: 50,
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
    {
      title: "IMAGE LOG",
      dataIndex: "image_log",
      key: "image_log",
      align: "center",
      // width: 100,
    },
  ];
  return (
    <div>
      <div className="flex space-x-5 w-full justify-start">
        <div className="w-[40%] space-y-2">
          <div className="">
            <label>Full Name</label>
            <input
              type="text"
              className="w-full h-12 rounded-lg  shadow-inner shadow-fuchsia-400"
              //   placeholder="Warehouse Name"
            />
          </div>
          <div className="">
            <label>Phone Number</label>
            <input
              type="text"
              className="w-full h-12 rounded-lg  shadow-inner shadow-fuchsia-400"
              //   placeholder="Warehouse Name"
            />
          </div>
        </div>
        <div className="w-[40%]">
          <label>Assigned Area</label>
          <input
            type="text"
            className="w-full h-32 rounded-lg  shadow-inner shadow-fuchsia-400"
            // placeholder="Warehouse Name"
          />
        </div>
      </div>
      <div className="font-bold text-2xl">Delivery History</div>
      <div>
        <DataTable
          data={dataHistory}
          columns={HistoryHeaders}
          pagination={true}
          //   onRow={(record, rowIndex) => {
          //     return {
          //       onClick: () => {
          //         setSelectedRowData(record);
          //       },
          //     };
          //   }}
        />
      </div>
    </div>
  );
};

export default AgentDetail;
