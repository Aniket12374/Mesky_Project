import { useState } from "react";
import DataTable from "../Common/DataTable/DataTable";
import AgentDetail from "../Agents/AgentDetail"; // Import the AgentDetail component
import { useQuery } from "react-query";
import { ridersList } from "../../services/riders/riderService";

const ListingPage = () => {
  const [selectedRowData, setSelectedRowData] = useState(null);

  const { data, isLoading } = useQuery("ridersList", ridersList);
  const riders = [];
  console.log({ data });
  data?.data?.data.map((rider) =>
    riders.push({
      s_no: rider.id,
      phone_number: rider.mobile_number,
      assigned_area: "",
      delivery_area: rider?.society.length > 0 ? rider.society[0].street : "",
      status: rider?.status,
      align: "center",
      agent_name: rider?.full_name,
    })
  );

  const [dataHistory, setDataHistory] = useState([
    {
      s_no: "1",
      phone_number: "1234567890",
      assigned_area: "CENTRAL PARK FLOWER VALLEY, SECTOR 50, GURGAON-50",
      delivery_area: "CENTRAL PARK FLOWER VALLEY, SECTOR 50, GURGAON-50",
      status: "Available",
      align: "center",
      agent_name: "manan",
    },
    {
      s_no: "2",
      phone_number: "1234567890",
      assigned_area: "CENTRAL PARK FLOWER VALLEY, SECTOR 50, GURGAON-50",
      delivery_area: "CENTRAL PARK FLOWER VALLEY, SECTOR 50, GURGAON-50",
      status: "Pending",
      align: "center",
      agent_name: "manan",
    },
    {
      s_no: "3",
      phone_number: "1234567890",
      assigned_area: "CENTRAL PARK FLOWER VALLEY, SECTOR 50, GURGAON-50",
      delivery_area: "CENTRAL PARK FLOWER VALLEY, SECTOR 50, GURGAON-50",
      status: "Available",
      align: "center",
      agent_name: "manan",
    },
  ]);

  const HistoryHeaders = [
    {
      title: "S.NO",
      dataIndex: "s_no",
      align: "center",
      key: "s_no",
      width: 50,
    },
    {
      title: "AGENTS",
      dataIndex: "agent_name",
      key: "agent_name",
      align: "center",
      width: 50,
    },
    {
      title: "PHONE NUMBER",
      dataIndex: "phone_number",
      key: "phone_number",
      align: "center",
      width: 50,
    },
    {
      title: "ASSIGNED AREA",
      dataIndex: "assigned_area",
      key: "assigned_area",
      align: "center",
      width: 50,
    },
    {
      title: "DELIVERY AREA",
      dataIndex: "delivery_area",
      key: "delivery_area",
      align: "center",
      width: 50,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 50,
    },
  ];

  return (
    <div>
      {selectedRowData ? (
        <AgentDetail rowData={selectedRowData} />
      ) : (
        <DataTable
          data={riders}
          columns={HistoryHeaders}
          pagination={true}
          loading={isLoading}
          onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                setSelectedRowData(record);
              },
            };
          }}
        />
      )}
    </div>
  );
};

export default ListingPage;
