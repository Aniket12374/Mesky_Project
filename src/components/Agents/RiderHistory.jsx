import React, { useEffect, useState } from "react";
import { getRiderHistory } from "../../services/riders/riderService";
import DataTable from "../Common/DataTable/DataTable";

const colorStatus = {
  DELIVERED: "#9c29c1",
  "IN PROGRESS": "#FFD700",
  CANCELLED: "#FF0028",
  RECIEVED: "#9c29c1",
  "NOT RECEIVED": "#FFD700",
};

function RiderHistory({ rowData }) {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    getRiderHistory(rowData?.s_no).then((res) => {
      let list = [];
      res?.data?.data.map((x) => {
        list.push({
          order_date: x.accept_date,
          order_id: x.order.uid,
          customer_name: x.order.full_name,
          society_name: x.society.name,
          delivery: x.order.line_1 + " " + x.order.line_2,
          agent_name: x.rider.map((x) => x.full_name),
          status: x.status.del_status,
          del_image: x.status.del_img,
          image_log: x.status.img_status,
          align: "center",
        });
      });

      setHistoryData(list);
    });
  }, []);

  const HistoryHeaders = [
    {
      title: "ORDER DATE",
      dataIndex: "order_date",
      // align: "center",
      key: "order_date",
      width: 100,
    },
    {
      title: "ORDER ID",
      dataIndex: "order_id",
      key: "order_id",
      // align: "center",
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customer_name",
      // align: "center",
      key: "customer_name",
    },
    {
      title: "SOCIETY NAME",
      dataIndex: "society_name",
      // align: "center",
      key: "society_name",
    },

    {
      title: "DELIVERY ADDRESS",
      dataIndex: "delivery",
      // align: "center",
      key: "delivery",
    },

    {
      title: "AGENT NAME",
      dataIndex: "agent_name",
      key: "agent_name",
      // align: "center",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      // align: "center",
      render: (status) => (
        <div style={{ color: colorStatus[status] }}>{status}</div>
      ),
    },
    {
      title: "IMAGE LOG",
      dataIndex: "image_log",
      key: "image_log",
      // align: "center",
      render: (image_log) => (
        <div style={{ color: colorStatus[image_log] }}>{image_log}</div>
      ),
    },
  ];

  return (
    <div>
      <div>
        <div className="font-bold text-2xl pt-5">Delivery History</div>
        <div>
          <DataTable
            data={historyData}
            columns={HistoryHeaders}
            pagination={false}
            fileName={`${rowData?.agent_name}_Agent_Past_Trips.csv`}
          />
        </div>
      </div>
    </div>
  );
}

export default RiderHistory;
