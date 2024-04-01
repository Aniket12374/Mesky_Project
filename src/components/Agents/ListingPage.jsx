import { useState } from "react";
import DataTable from "../Common/DataTable/DataTable";
import AgentDetail from "../Agents/AgentDetail"; // Import the AgentDetail component
import { useQuery } from "react-query";
import { ridersList } from "../../services/riders/riderService";
import Button from "../Common/Button";
import { useNavigate } from "react-router-dom";

const colorStatus = {
  AVAILABLE: "#9c29c1",
  "NOT AVAILABLE": "#FF0028",
};

const ListingPage = ({ setShowAgentCreation }) => {
  const [selectedRowData, setSelectedRowData] = useState(null);

  const { data, isLoading, refetch, isError } = useQuery(
    "ridersList",
    ridersList
  );

  const navigate = useNavigate();
  if (isError) {
    return navigate("/login");
  }
  const riders = [];
  data?.data?.data.map((rider) => {
    let areas = rider?.society.map((x) => x.sector);
    let assignedArea = new Set(areas);
    riders.push({
      s_no: rider.id,
      phone_number: rider.mobile_number,
      assigned_area: Array.from(assignedArea),
      delivery_area: Array.from(assignedArea),
      status: rider?.status,
      align: "center",
      agent_name: rider?.full_name,
    });
  });

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
      render: (status) => (
        <div style={{ color: colorStatus[status] }}>{status}</div>
      ),
    },
  ];

  return (
    <div>
      {selectedRowData ? (
        <AgentDetail
          rowData={selectedRowData}
          setShowAgentCreation={setShowAgentCreation}
          setSelectedRowData={setSelectedRowData}
          refetch={refetch}
        />
      ) : (
        <div>
          <div className="float-right">
            <Button
              btnName={"+ Add Agent"}
              onClick={() => setShowAgentCreation(true)}
            />
          </div>
          <DataTable
            data={riders}
            columns={HistoryHeaders}
            pagination={true}
            loading={isLoading}
            onRow={(record, rowIndex) => {
              return {
                onClick: () => {
                  setSelectedRowData(record);
                  setShowAgentCreation(false);
                },
              };
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ListingPage;
