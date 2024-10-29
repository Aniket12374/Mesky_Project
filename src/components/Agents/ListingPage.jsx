import { useState } from "react";
import DataTable from "../Common/DataTable/DataTable";
import AgentDetail from "../Agents/AgentDetail"; // Import the AgentDetail component
import { useQuery } from "react-query";
import { ridersList } from "../../services/riders/riderService";
import Button from "../Common/Button";
import { useNavigate } from "react-router-dom";
import { Pagination } from "antd";
import AgentCreation from "./AgentCreation";

const colorStatus = {
  AVAILABLE: "#9c29c1",
  "NOT AVAILABLE": "#FF0028",
};

const ListingPage = ({ setShowAgentCreation }) => {
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(10);

  const { data, isLoading, refetch, isError } = useQuery(
    ["ridersList", currentPage, size],
    () => ridersList(currentPage, size)
  );
  const totalDataCount = data?.data?.totalCount;

  const navigate = useNavigate();
  if (isError) {
    return navigate("/login");
  }
  const riders = [];
  data?.data?.data.map((rider) => {
    let areas = rider?.society.map((x) => x.sector);
    let list = new Set(areas);

    const check = (index) => (list.size === index + 1 ? "" : ", ");
    let areasList = Array.from(list).map(
      (riderArea, index) => riderArea + check(index)
    );

    riders.push({
      s_no: rider.id,
      phone_number: rider.mobile_number,
      assigned_area: areasList,
      verify: rider.r_verif,
      status: rider?.status,
      agent_name: rider?.full_name,
      society_ids: rider?.society?.map((x) => x.id),
    });
  });

  // Sort riders by status: "AVAILABLE" first, then "NOT AVAILABLE"
  riders.sort((a, b) => {
    if (a.status === "AVAILABLE" && b.status !== "AVAILABLE") {
      return -1;
    }
    if (a.status !== "AVAILABLE" && b.status === "AVAILABLE") {
      return 1;
    }
    return 0;
  });

  const uniqueAssignedArea = Array.from(
    new Set(
      riders
        .map((listingData) => listingData?.assigned_area)
        .flat()
        .sort()
    )
  );

  const HistoryHeaders = [
    // {
    //   title: "S.NO",
    //   dataIndex: "s_no",
    //   key: "s_no",
    //   // width: 50,
    // },
    {
      title: "AGENTS",
      dataIndex: "agent_name",
      key: "agent_name",
      // width: 50,
    },
    {
      title: "PHONE NUMBER",
      dataIndex: "phone_number",
      key: "phone_number",
      // width: 50,
    },
    {
      title: "ASSIGNED AREA",
      dataIndex: "assigned_area",
      key: "assigned_area",
      // width: 50,
      filters: uniqueAssignedArea.map((assignedArea) => ({
        text: assignedArea,
        value: assignedArea,
      })),
      //  width: 120,
      filterSearch: true, // Enable search bar for this filter
      onFilter: (value, record) => record.assigned_area.includes(value),
    },
    {
      title: "VERIFICATION",
      dataIndex: "verify",
      key: "verify",
      // width: 50,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      // width: 50,
      render: (status) => (
        <div style={{ color: colorStatus[status] }}>{status}</div>
      ),
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const pageSizeOptions = Array.from(
    { length: Math.ceil(totalDataCount / 10) },
    (_, index) => `${(index + 1) * 10}`
  );

  const handlePageSizeChange = (current, page) => {
    setSize(page);
  };

  return (
    <div>
      <style>
        {`
        .ant-table-thead th {
          vertical-align: bottom; // Aligning titles at the bottom
        }
      `}
      </style>
      {selectedRowData ? (
        <AgentCreation
          rowData={selectedRowData}
          setShowAgentCreation={setShowAgentCreation}
          setSelectedRowData={setSelectedRowData}
          refetch={refetch}
        />
      ) : (
        <div>
          <div className="float-right">
            {/* <Button
              btnName={"+ Add Agent"}
              onClick={() => setShowAgentCreation(true)}
            /> */}
          </div>
          <DataTable
            data={riders}
            fileName="Agents_Listing.csv"
            columns={HistoryHeaders}
            loading={isLoading}
            onRow={(record, rowIndex) => {
              return {
                onClick: () => {
                  setSelectedRowData(record);
                  setShowAgentCreation(false);
                },
              };
            }}
            scroll={{
              y: "calc(100vh - 360px)",
            }}
            // pagination={paginationConfig}
          />
          <div className="flex justify-end px-4 py-2">
            <Pagination
              current={currentPage}
              total={totalDataCount}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${totalDataCount} items`
              }
              onChange={handlePageChange}
              showSizeChanger={true}
              pageSizeOptions={pageSizeOptions}
              onShowSizeChange={handlePageSizeChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingPage;
