import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import Cookies from "js-cookie";
import DataTable from "../Common/DataTable/DataTable";
import {
  historySearch,
  previousOrders,
} from "../../services/subscriptionOrders/subscriptionService";
import { useNavigate } from "react-router-dom";
import { Modal, Pagination } from "antd";
import { customAlphNumericSort } from "../../utils";
import RefundModal from "../shared/RefundModal";

const ListingPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(10);
  const [searchPage, setSearchPage] = useState(1);
  const [searchSize, setSearchSize] = useState(10);
  const [search, setSearch] = useState("");
  const [param, setParam] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [isQueryEnabled, setIsQueryEnabled] = useState(false);
  const [showSearchData, setShowSearchData] = useState(false);
  // const [csvLoader, setCsvLoader] = useState(false);
  const [filteredDataCount, setFilteredDataCount] = useState(null);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [imagePopupVisible, setImagePopupVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTotalCount, setSearchTotalCount] = useState(0);
  const [change, setChange] = useState({
    refundModalOpen: false,
    // societyModalOpen: false,
    modalData: {},
    refAmount: "",
    reason: "",
  });

  const { data, isLoading, isError, refetch } = useQuery(
    ["previousOrders", currentPage, size],
    () => previousOrders(currentPage, size),
    {
      enabled: shouldFetch, // Only fetch when shouldFetch is true
      onSuccess: () => setShouldFetch(false), // Disable fetch after success
    }
  );

  const isRefundUser = Cookies.get("refundUser");

  const {
    data: searchResult,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useQuery(
    ["historySearch", searchPage, searchSize, param], // Use search parameters in query key
    () => historySearch(searchPage, searchSize, param), // Remove unnecessary arguments
    {
      enabled: isQueryEnabled,
      onSuccess: () => setIsQueryEnabled(false),
    }
  );

  let tableData =
    search && showSearchData ? searchResult?.data || searchData : data?.data;

  useEffect(() => {
    if (tableData) {
      setTotalDataCount(tableData?.totalCount);
      if (Object.keys(selectedFilters).length === 0) {
        setFilteredDataCount(tableData?.data.length);
      } else {
        handleChange(currentPage, selectedFilters, null);
      }
    }
  }, [data, searchData]);

  if (isError) {
    return navigate("/login");
  }

  let historyData = [];
  tableData?.data.map((listingData) => {
    const ridersCount = listingData?.rider?.length;
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
      date: listingData?.accept_date
        ? listingData?.accept_date.split(" ")[0]
        : null,
      item_uid: listingData?.item_uid,
      order_id: listingData?.order?.uid,
      customer_name: finalCustomerName,
      society_name: listingData?.society?.name,
      "Pin code": listingData?.order?.pincode,
      phone_number: listingData?.order?.mobile_number,
      unit_qty: listingData?.unit_quantity,
      Walletamount: listingData?.wallet_amount,
      quantity: listingData?.quantity,
      product: listingData?.product_name,
      sectors: listingData?.society?.sector || "",
      delivery: listingData?.order?.line_1 + " " + listingData?.order?.line_2,
      agent_name: listingData?.rider?.map((rider, key) => {
        let comma = ridersCount - 1 !== key ? ", " : "";
        return rider.full_name + comma;
      }),
      city: listingData?.order?.city,
      state: listingData?.order?.state,
      status: delStatus,
      delImg: listingData?.status?.del_img,
      not_del_reason: listingData?.status?.not_del_reason,
      del_time: listingData?.delivery_date
        ? listingData?.delivery_date?.split(" ")[1]
        : null,
      "Brand name": listingData?.brand_name,
      MRP_of_Product: listingData?.item_price,
      OrderValue: listingData?.total_price,
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

  const uniquePhoneNumbers = Array.from(
    new Set(historyData.map((x) => x.phone_number))
  ).sort();

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

  const uniqueProducts = Array.from(
    new Set(
      historyData
        .map((listingData) => listingData?.product)
        .sort(customAlphNumericSort)
    )
  );

  const uniqueSectors = Array.from(
    new Set(
      historyData
        .map((listingData) => listingData?.sectors)
        .sort(customAlphNumericSort)
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
      title: "PHONE NUMBER",
      dataIndex: "phone_number",
      key: "phone_number",
      filters: uniquePhoneNumbers.map((phoneNumber) => ({
        text: phoneNumber,
        value: phoneNumber,
      })),
      filterSearch: true,
      onFilter: (value, record) => record.phone_number?.indexOf(value) == 0,
    },

    {
      title: "QTY",
      dataIndex: "quantity",
      key: "quantity",
      width: 60,
    },
    {
      title: "UNIT QUANTITY",
      dataIndex: "unit_qty",
      key: "unit_qty",
    },
    {
      title: "PRODUCT",
      dataIndex: "product",
      key: "product",
      width: 100,
      filters: uniqueProducts.map((product) => ({
        text: product.length > 60 ? product.slice(0, 60) + "..." : product,
        value: product,
      })),
      filterSearch: true,
      onFilter: (value, record) => record.product === value,
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
      title: "SECTOR",
      dataIndex: "sectors",
      key: "sectors",
      filters: uniqueSectors.map((sector) => ({ text: sector, value: sector })),
      filterSearch: true,
      onFilter: (value, record) => record.sectors === value,
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
      width: 130,
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
                  alt='Delivery Image'
                  style={{ maxWidth: "100px", maxHeight: "100px" }}
                />
              </div>
              <div>DELIVERED AT {record.del_time}</div>
            </>
          );
        } else if (record.status) {
          return (
            <div>
              <span
                style={{ color: record.status === "PENDING" ? "red" : "blue" }}
              >
                {record.status}
              </span>
              {record.status === "NOT DELIVERED" && record.not_del_reason && (
                <div>{record.not_del_reason}</div>
              )}
            </div>
          );
        }
      },
    },
  ];

  if (isRefundUser == "true") {
    HistoryHeaders.push({
      title: "Refund",
      key: "refund",
      dataIndex: "refund",
      render: (refund, record) =>
        record.del_time &&
        record.status == "DELIVERED" && (
          <div className='px-2'>
            <button
              className='bg-[#DF4584] rounded-2xl text-white p-2'
              onClick={() => handleModalRef(record)}
            >
              Refund
            </button>
          </div>
        ),
    });
  }

  const handlePageChange = (page) => {
    if (showSearchData) {
      setSearchPage(page);
      setIsQueryEnabled(true);
    } else {
      setCurrentPage(page);
      setShouldFetch(true);
    }
  };
  const pageSizeOptions = Array.from(
    { length: Math.ceil(searchTotalCount || tableData?.totalCount / 250) },
    (_, index) => `${(index + 1) * 250}`
  );

  const handlePageSizeChange = (current, page) => {
    if (showSearchData) {
      setSearchSize(page);
    } else {
      setSize(page);
    }
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

  const handleSearch = async () => {
    const searchValue = search;
    await historySearch(searchPage, searchSize || size, searchValue).then(
      (res) => {
        setSearchData(res?.data);
        setSearchTotalCount(res?.totalCount || 0);
        setShowSearchData(true);
        setParam(search);
        setSize(10);
      }
    );
  };

  const handleModalRef = (record) => {
    setChange((prev) => ({
      ...prev,
      modalData: record,
      refundModalOpen: !change?.refundModalOpen,
    }));
  };
  // const handleDownloadCsv = () => {
  //   setCsvLoader(true);
  //   downloadCsv()
  //     .then((res) => {
  //       setCsvLoader(false);
  //       const pdfUrl = res?.data?.file_url;
  //       const link = document.createElement("a");
  //       link.href = pdfUrl;
  //       link.download = "document.pdf"; // specify the filename
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //       toast.success("Successfully downloaded!");
  //     })
  //     .catch((err) => {
  //       setCsvLoader(false);
  //       toast.error("Failed, Please try again after sometime!");
  //     });
  // };

  return (
    <div>
      <style>
        {`
        .ant-table-thead th {
          vertical-align: bottom; // Aligning titles at the bottom
        }
      `}
      </style>
      {/* <button
        onClick={handleDownloadCsv}
        disabled={csvLoader}
        className="bg-[#ff0000] text-white p-2 mr-2 rounded-lg relative top-2"
      >
        {csvLoader ? "Downloading..." : "Download All Data"}
      </button> */}
      <div className='float-right font-medium'>
        Showing Results: {filteredDataCount}/{totalDataCount}
      </div>
      <DataTable
        data={historyData}
        columns={HistoryHeaders}
        // pagination={paginationConfig}
        loading={isSearchLoading || isLoading}
        onFilteredDataChange={handleFilteredDataCount}
        onChange={handleChange}
        fileName='History_Listing.csv'
        scroll={{
          y: "calc(100vh - 390px)",
        }}
        setSearch={setSearch}
        search={search}
        setSearchData={setSearchData}
        setShowSearchData={setShowSearchData}
        handleSearch={handleSearch}
      />
      <div className='flex justify-end px-4 py-2'>
        <Pagination
          current={showSearchData ? searchPage : currentPage}
          total={tableData?.totalCount || searchTotalCount}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${
              searchTotalCount || tableData?.totalCount
            } items`
          }
          onChange={handlePageChange}
          showSizeChanger={true}
          pageSizeOptions={pageSizeOptions} // Use pageSizeOptions only for search results
          onShowSizeChange={handlePageSizeChange}
          disabled={isLoading || isSearchLoading}
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
            alt='Delivery Image'
            style={{ maxWidth: "100%" }}
          />
        )}
      </Modal>
      <RefundModal
        change={change}
        setChange={setChange}
        handleModalRef={handleModalRef}
      />
    </div>
  );
};

export default ListingPage;
