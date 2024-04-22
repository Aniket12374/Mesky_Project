import { useEffect, useState } from "react";
import DataTable from "../Common/DataTable/DataTable";
import { useQuery } from "react-query";
import { presentOrders } from "../../services/subscriptionOrders/subscriptionService";
import { useNavigate } from "react-router-dom";
import { Pagination } from "antd";
import { subscriptionPause } from "../../services/subscriptionOrders/subscriptionService";
import toast from "react-hot-toast";

const ListingPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(10);

  const { data, isLoading, isError } = useQuery(
    ["presentOrders", currentPage, size],
    () => presentOrders(currentPage, size)
  );
  const [filteredDataCount, setFilteredDataCount] = useState(null);
  const [totalDataCount, setTotalDataCount] = useState(0);
  useEffect(() => {
    if (data && data.data && data.data.data) {
      setTotalDataCount(data.data.totalCount);
      setFilteredDataCount(data.data.data.length);
    }
  }, [data]);

  if (isError) {
    return navigate("/login");
  }

  const uniqueSocietyNames = Array.from(
    new Set(data?.data?.data.map((listingData) => listingData?.society?.name))
  );
  const uniquePincodes = Array.from(
    new Set(data?.data?.data.map((listingData) => listingData?.order?.pincode))
  );
  const uniqueSectors = Array.from(
    new Set(data?.data?.data.map((listingData) => listingData?.society?.sector))
  );
  const uniqueAgentNames = Array.from(
    new Set(
      data?.data?.data.flatMap((listingData) =>
        listingData?.rider?.map((rider) => rider.full_name)
      )
    )
  );
  const uniqueStatuses = Array.from(
    new Set(data?.data?.data.map((listingData) => listingData?.status?.name))
  );

  let historyData = [];
  data?.data?.data.map((listingData) => {
    const ridersCount = listingData?.rider?.length;
    const truncatedOrderId = listingData?.order?.uid.slice(-8); // Truncate to last 8 characters
    const customerName = listingData?.order?.full_name;
    let arr = customerName.split(" ");
    let name = arr.filter((x) => x !== "");
    let finalCustomerName = name.reduce((x, acc) => x + " " + acc);
    historyData.push({
      item_uid: listingData?.item_uid,
      order_id: truncatedOrderId,
      customer_name: finalCustomerName,
      society_name: listingData?.society?.name,
      pincode: listingData?.order?.pincode,
      phone_number: listingData?.order?.mobile_number,
      unit_qty: listingData?.order?.unit_quantity,
      qty: listingData?.order?.quantity,
      sectors: listingData?.society?.sector,
      delivery: listingData?.order?.line_1 + " " + listingData?.order?.line_2,
      agent_name: listingData?.rider?.map((rider, key) => {
        let comma = ridersCount - 1 !== key ? ", " : "";
        return rider.full_name + comma;
      }),
      status: listingData?.status?.status || "Pending",
    });
  });

  const handleFilteredDataCount = (filteredData) => {
    setFilteredDataCount(filteredData.length);
  };

  const handlePause = async (item_uid) => {
    try {
      const data = { item_uid };
      const response = await subscriptionPause(data);

      toast.success(response?.data.message);
    } catch (error) {
      toast.error(error);
    }
  };

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
      onFilter: (value, record) => {
        const filteredData = historyData.filter(
          (item) => item.society_name === value
        );
        handleFilteredDataCount(filteredData);
        return record.society_name === value;
      },
    },
    {
      title: "PINCODE",
      dataIndex: "pincode",
      key: "pincode",
      filters: uniquePincodes.map((pincode) => ({
        text: pincode,
        value: pincode,
      })),
      onFilter: (value, record) => {
        const filteredData = historyData.filter(
          (item) => item.pincode === value
        );
        handleFilteredDataCount(filteredData);
        return record.pincode === value;
      },
    },
    {
      title: "PHONE NUMBER",
      dataIndex: "phone_number",
      key: "phone_number",
    },

    {
      title: "SECTOR",
      dataIndex: "sectors",
      key: "sectors",
      filters: uniqueSectors.map((sector) => ({ text: sector, value: sector })),
      onFilter: (value, record) => {
        const filteredData = historyData.filter(
          (item) => item.sectors === value
        );
        handleFilteredDataCount(filteredData);
        return record.sectors === value;
      },
    },
    {
      title: "UNIT QUANTITY",
      dataIndex: "unit_qty",
      key: "unit_qty",
    },
    {
      title: "QUANTITY",
      dataIndex: "qty",
      key: "qty",
    },
    {
      title: "AGENT NAME",
      dataIndex: "agent_name",
      key: "agent_name",
      filters: uniqueAgentNames.map((agentName) => ({
        text: agentName,
        value: agentName,
      })),
      onFilter: (value, record) => {
        const filteredData = historyData.filter((item) =>
          item.agent_name.includes(value)
        );
        handleFilteredDataCount(filteredData);
        return record.agent_name.includes(value);
      },
    },
    {
      title: "DELIVERY ADDRESS",
      dataIndex: "delivery",
      key: "delivery",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      filters: uniqueStatuses.map((status) => ({
        text: status,
        value: status,
      })),
      onFilter: (value, record) => {
        const filteredData = historyData.filter(
          (item) => item.status === value
        );
        setFilteredDataCount(filteredData.length);
        return record.status === value;
      },
    },
    {
      title: "PAUSE ITEM",
      key: "item_uid",
      dataIndex: "item_uid",
      render: (item_uid) => (
        <button
          className="bg-[#DF4584] rounded-2xl text-white p-2"
          onClick={() => handlePause(item_uid)}
        >
          Pause
        </button>
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
      {/* <div>Total Data Count: {totalDataCount}</div> */}
      <div className="float-right font-medium">
        Showing Results: {filteredDataCount}/{totalDataCount}
      </div>
      <DataTable
        data={historyData}
        loading={isLoading}
        fileName="Subscription_Listing.csv"
        columns={HistoryHeaders}
        // pagination={paginationConfig}
        onFilteredDataChange={handleFilteredDataCount}
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
  );
};

export default ListingPage;
