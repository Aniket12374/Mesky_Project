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
  const [selectedFilters, setSelectedFilters] = useState({});

  const { data, isLoading, isError } = useQuery(
    ["presentOrders", currentPage, size],
    () => presentOrders(currentPage, size)
  );
  const [filteredDataCount, setFilteredDataCount] = useState(null);
  const [totalDataCount, setTotalDataCount] = useState(0);
  useEffect(() => {
    if (data && data.data && data.data.data) {
      setTotalDataCount(data.data.totalCount);
      Object.keys(selectedFilters).length == 0 &&
        setFilteredDataCount(data.data.data.length);

      Object.keys(selectedFilters).length > 0 && handleChange(currentPage, selectedFilters, null)
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
    let delStatus =
      Object.keys(listingData?.status).length === 0
        ? "PENDING"
        : listingData?.status?.del_status == "DELIVERED"
        ? "DELIVERED"
        : "NOT DELIVERED";
    historyData.push({
      item_uid: listingData?.item_uid,
      order_id: truncatedOrderId,
      customer_name: finalCustomerName,
      society_name: listingData?.society?.name,
      pincode: listingData?.order?.pincode,
      phone_number: listingData?.order?.mobile_number,
      unit_qty: listingData?.unit_quantity,
      qty: listingData?.quantity,
      sectors: listingData?.society?.sector,
      delivery: listingData?.order?.line_1 + " " + listingData?.order?.line_2,
      agent_name: listingData?.rider?.map((rider, key) => {
        let comma = ridersCount - 1 !== key ? ", " : "";
        return rider.full_name + comma;
      }),
      status: delStatus,
      delImg: listingData?.status?.del_img,
      del_time: listingData?.delivery_date ? listingData?.delivery_date?.split(' ')[1] : null
    });
  });

  const totalCustomerNames = historyData.map((x) => x.customer_name);
  const totalPhoneNumbers = historyData.map((x) => x.phone_number);

  const handleFilteredDataCount = (filteredData) => {
    setFilteredDataCount(filteredData.length);
  };

  const handlePause = async (item_uid) => {
    try {
      const data = { item_uid };
      const response = await subscriptionPause(data);

      toast.success(response?.data.message);
    } catch (error) {
      toast.error(error?.response.data.message);
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
      filters: totalCustomerNames.map((customerName) => ({
        text: customerName,
        value: customerName,
      })),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.customer_name.indexOf(value) === 0,
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
    // {
    //   title: "PINCODE",
    //   dataIndex: "pincode",
    //   key: "pincode",
    //   filters: uniquePincodes.map((pincode) => ({
    //     text: pincode,
    //     value: pincode,
    //   })),
    //   onFilter: (value, record) => {
    //     const filteredData = historyData.filter(
    //       (item) => item.pincode === value
    //     );
    //     handleFilteredDataCount(filteredData);
    //     return record.pincode === value;
    //   },
    // },
    {
      title: "PHONE NUMBER",
      dataIndex: "phone_number",
      key: "phone_number",
      filters: totalPhoneNumbers.map((phoneNumber) => ({
        text: phoneNumber,
        value: phoneNumber,
      })),
      onFilter: (value, record) => record.phone_number.indexOf(value) == 0,
    },

    {
      title: "SECTOR",
      dataIndex: "sectors",
      key: "sectors",
      filters: uniqueSectors.map((sector) => ({ text: sector, value: sector })),
      onFilter: (value, record) => record.sectors === value,
    },
    // {
    //   title: "UNIT QUANTITY",
    //   dataIndex: "unit_qty",
    //   key: "unit_qty",
    // },
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
      //  width: 120,
      onFilter: (value, record) => record.agent_name.includes(value),
    },
    {
      title: "DELIVERY ADDRESS",
      dataIndex: "delivery",
      key: "delivery",
      ellipsis: true,
      // width: 150,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "DELIVERED",
          value: "DELIVERED",
        },
        {
          text: "NOT DELIVERED",
          value: "NOT DELIVERED",
        },
        {
          text: "PENDING",
          value: "PENDING",
        },
      ],
        // width: 90,
      onFilter: (value, record) => record.status == value,
      render: (text, record) => {
        if (record.delImg) {
          // If del_img is present, render the image
          return (
            <>
            <img
              src={record.delImg}
              alt="Delivery Image"
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
            <div>DELIVERED AT {record.del_time}</div>
            </>
          );
        } else if (record.status) {
          return (
            <span
              style={{ color: record.status == "PENDING" ? "red" : "blue" }}
            >
              {record.status}
            </span>
          );
        }
      },
    },

    {
      title: "PAUSE ITEM",
      key: "item_uid",
      dataIndex: "item_uid",
      // width: 60,
      render: (item_uid, record) =>
        (record.status = "PENDING" && (
          <button
            className="bg-[#DF4584] rounded-2xl text-white p-2"
            onClick={() => handlePause(item_uid)}
          >
            Pause
          </button>
        )),
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

  const handleChange = (pagination, filters, sorter) => {
    const nonEmptyFilters = {};
    Object.keys(filters).map((x) => {
      if (filters[x]?.length > 0) nonEmptyFilters[x] = filters[x];
    });
    setSelectedFilters(nonEmptyFilters);
    let filteredData = historyData.filter((item) => {
      for (let key in nonEmptyFilters) {
        if(key === 'agent_name') {
          if(!item[key].some( (agent) => nonEmptyFilters[key].includes(agent))){
            return false
          }
        }else {
          if (!nonEmptyFilters[key].includes(item[key])) {
            return false;
          }
        }
      }
      return true;
    });
    handleFilteredDataCount(filteredData);
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
        onChange={handleChange}
        // pagination={paginationConfig}
        onFilteredDataChange={handleFilteredDataCount}
        scroll={{
          y: "calc(100vh - 350px)",
        }} 
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
