import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import DataTable from "../Common/DataTable/DataTable";
import { previousOrders } from "../../services/subscriptionOrders/subscriptionService";
import { useNavigate } from "react-router-dom";
import { Modal, Pagination } from "antd";

const ListingPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(10);
  const { data, isLoading, isError } = useQuery(
    ["previousOrders", currentPage, size],
    () => previousOrders(currentPage, size)
  );

  const [filteredDataCount, setFilteredDataCount] = useState(null);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [imagePopupVisible, setImagePopupVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (data && data.data && data.data.data) {
      setTotalDataCount(data.data.totalCount);
      Object.keys(selectedFilters).length == 0 &&
        setFilteredDataCount(data.data.data.length);
      Object.keys(selectedFilters).length > 0 &&
        handleChange(currentPage, selectedFilters, null);
    }
  }, [data]);

  if (isError) {
    return navigate("/login");
  }

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
      order_id: truncatedOrderId,
      date: listingData?.delivery_date
        ? listingData?.delivery_date.split(" ")[0]
        : null,
      customer_name: finalCustomerName,
      quantity: listingData?.quantity,
      society_name: listingData?.society?.name,
      delivery: listingData?.order?.line_1 + " " + listingData?.order?.line_2,
      agent_name: listingData?.rider?.map((rider, key) => {
        let comma = ridersCount - 1 !== key ? ", " : "";
        return rider.full_name + comma;
      }),
      status: delStatus,
      delImg: listingData?.status?.del_img,
      del_time: listingData?.delivery_date
        ? listingData?.delivery_date?.split(" ")[1]
        : null,
    });
  });

  let totalCustomerNames = Array.from(
    new Set(
      historyData.map((x) => x.customer_name).sort((a, b) => a.localeCompare(b))
    )
  );

  const handleFilteredDataCount = (filteredData) => {
    setFilteredDataCount(filteredData.length);
  };

  const uniqueSocietyNames = Array.from(
    new Set(historyData.map((listingData) => listingData?.society_name).sort())
  );

  const uniqueAgentNames = Array.from(
    new Set(
      historyData
        .map((listingData) => listingData?.agent_name)
        .flat()
        .sort()
    )
  );
  const uniqueDates = Array.from(
    new Set(
      historyData
        .map((listingData) => listingData?.date)
        .sort((a, b) => new Date(a) - new Date(b))
    )
  );

  const openImagePopup = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImagePopupVisible(true);
  };

  const closeImagePopup = () => {
    setSelectedImage(null);
    setImagePopupVisible(false);
  };

  const HistoryHeaders = [
    {
      title: "ORDER ID",
      dataIndex: "order_id",
      key: "order_id",
      width: 100,
    },
    {
      title: "DATE",
      dataIndex: "date",
      key: "date",
      width: 120,
      filters: uniqueDates.map((deliveredDate) => ({
        text: deliveredDate,
        value: deliveredDate,
      })),
      filterSearch: true, // Enable search bar for this filter
      onFilter: (value, record) => record.date == value,
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customer_name",
      key: "customer_name",
      filters: totalCustomerNames.map((customerName) => ({
        text: customerName,
        value: customerName,
      })),
      filterSearch: true, // Enable search bar for this filter
      onFilter: (value, record) => record.customer_name.indexOf(value) === 0,
    },
    {
      title: "QTY",
      dataIndex: "quantity",
      key: "quantity",
      width: 60,
    },
    {
      title: "SOCIETY NAME",
      dataIndex: "society_name",
      key: "society_name",
      filters: uniqueSocietyNames.map((societyName) => ({
        text: societyName,
        value: societyName,
      })),
      filterSearch: true, // Enable search bar for this filter
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
      filterSearch: true, // Enable search bar for this filter
      onFilter: (value, record) => record.agent_name.includes(value),
      width: 200,
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
      filterSearch: true, // Enable search bar for this filter

      onFilter: (value, record) => record.status == value,
      render: (text, record) => {
        if (record.delImg) {
          return (
            <>
              <div onClick={() => openImagePopup(record.delImg)}>
                <img
                  src={record.delImg}
                  alt="Delivery Image"
                  style={{ maxWidth: "100px", maxHeight: "100px" }}
                />
              </div>
              <div>DELIVERED AT {record.del_time}</div>
            </>
          );
        } else if (record.status) {
          return (
            <span
              style={{ color: record.status === "PENDING" ? "red" : "blue" }}
            >
              {record.status}
            </span>
          );
        }
      },
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const pageSizeOptions = Array.from(
    { length: Math.ceil(totalDataCount / 50) },
    (_, index) => `${(index + 1) * 50}`
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
        if (key == "agent_name") {
          if (!item[key].some((x) => nonEmptyFilters[key].includes(x))) {
            return false;
          }
        } else {
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
      <div className="float-right font-medium">
        Showing Results: {filteredDataCount}/{totalDataCount}
      </div>
      <DataTable
        data={historyData}
        columns={HistoryHeaders}
        // pagination={paginationConfig}
        loading={isLoading}
        onFilteredDataChange={handleFilteredDataCount}
        onChange={handleChange}
        fileName="History_Listing.csv"
        scroll={{
          y: "calc(100vh - 333px)",
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
      <Modal
        open={imagePopupVisible}
        onCancel={closeImagePopup}
        footer={null}
        centered
      >
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Delivery Image"
            style={{ maxWidth: "100%" }}
          />
        )}
      </Modal>
    </div>
  );
};

export default ListingPage;
