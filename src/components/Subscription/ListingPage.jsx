import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CSVLink } from "react-csv";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { Button, Pagination, Modal } from "antd";
import {
  csvUpload,
  downloadCsv,
  presentOrders,
  reAssignAgent,
  SubscriptionSearch,
  subscriptionSocietyChange,
} from "../../services/subscriptionOrders/subscriptionService";
import {
  subscriptionPause,
  subscriptionQtyChange,
} from "../../services/subscriptionOrders/subscriptionService";
import DataTable from "../Common/DataTable/DataTable";
import { customAlphNumericSort } from "../../utils";

const ListingPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(10);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [imagePopupVisible, setImagePopupVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [isQueryEnabled, setIsQueryEnabled] = useState(false);
  const [csvLoader, setCsvLoader] = useState(false);
  const [showSearchData, setShowSearchData] = useState(false);
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [searchPage, setSearchPage] = useState(1);
  const [searchSize, setSearchSize] = useState(10);
  const [param, setParam] = useState("");

  const { data, isLoading, isError, refetch, isRefetching } = useQuery(
    ["presentOrders", currentPage, size],
    () => presentOrders(currentPage, size),
    {
      enabled: shouldFetch, // Only fetch when shouldFetch is true
      onSuccess: () => setShouldFetch(false), // Disable fetch after success
    }
  );

  const {
    data: searchResult,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useQuery(
    ["SubscriptionSearch", searchPage, searchSize, param],
    () => SubscriptionSearch(searchPage, searchSize, param),
    {
      enabled: isQueryEnabled,
      onSuccess: () => setIsQueryEnabled(false),
    }
  );

  const [filteredDataCount, setFilteredDataCount] = useState(null);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [searchTotalCount, setSearchTotalCount] = useState(0);

  const [quantityChange, setQuantityChange] = useState({
    modalOpen: false,
    modalData: {},
    for_future_order: false,
    changedQty: 1,
  });

  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [change, setChange] = useState({
    quantityModalOpen: false,
    societyModalOpen: false,
    modalData: {},
    society: "",
    sector: "",
    for_future_order: false,
    changedQty: 1,
  });
  const [file, setFile] = useState();

  const handleCsvUpload = (event) => {
    setFile(event.target.files);
  };

  let tableData =
    search && showSearchData ? searchResult?.data || searchData : data?.data;

  useEffect(() => {
    if (tableData) {
      setTotalDataCount(tableData?.totalCount);
      Object.keys(selectedFilters).length == 0 &&
        setFilteredDataCount(tableData?.data.length);

      Object.keys(selectedFilters).length > 0 &&
        handleChange(currentPage, selectedFilters, null);
    }
  }, [data, searchData]);

  if (isError) {
    return navigate("/login");
  }
  let historyData = [];
  tableData?.data?.map((listingData) => {
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
      item_uid: listingData?.item_uid,
      order_id: listingData?.order?.uid,
      "Product ID": listingData?.product_id,
      "Order Value": listingData?.total_price,
      "MRP Of Product": listingData?.item_price,
      "Brand Name": listingData?.brand_name,
      customer_name: finalCustomerName,
      society_name: listingData?.society?.name,
      pincode: listingData?.order?.pincode,
      phone_number: listingData?.order?.mobile_number,
      unit_qty: listingData?.unit_quantity,
      wallet_amount: listingData?.wallet_amount,
      qty: listingData?.quantity,
      product: listingData?.product_name,
      sectors: listingData?.society?.sector || "",
      delivery: listingData?.order?.line_1 + " " + listingData?.order?.line_2,
      agent_name: listingData?.rider
        ? listingData?.rider.map((rider) => rider?.full_name).join(", ")
        : "",
      status: delStatus,
      delImg: listingData?.status?.del_img,
      not_del_reason: listingData?.status?.not_del_reason,
      del_time: listingData?.delivery_date
        ? listingData?.delivery_date?.split(" ")[1]
        : null,
    });
  });

  const uniqueSocietyNames = Array.from(
    new Set(historyData?.map((listingData) => listingData?.society_name).sort())
  );
  // const uniquePincodes = Array.from(
  //   new Set(historyData.map((listingData) => listingData?.order?.pincode))
  // );
  const uniqueSectors = Array.from(
    new Set(
      historyData
        .map((listingData) => listingData?.sectors)
        .sort(customAlphNumericSort)
    )
  );

  const uniqueProducts = Array.from(
    new Set(
      historyData
        .map((listingData) => listingData?.product)
        .sort(customAlphNumericSort)
    )
  );

  const uniqueAgentNames = Array?.from(
    new Set(
      historyData
        ?.map((listingData) => listingData?.agent_name)
        .flat()
        .sort()
    )
  );

  const uniqueStatuses = Array.from(
    new Set(historyData.map((listingData) => listingData?.status?.name))
  );
  const uniquePhoneNumbers = Array.from(
    new Set(historyData.map((x) => x.phone_number))
  ).sort();

  let totalCustomerNames = Array.from(
    new Set(
      historyData.map((x) => x.customer_name).sort((a, b) => a.localeCompare(b))
    )
  );

  // const totalPhoneNumbers = historyData.map((x) => x.phone_number).sort();

  const handleFilteredDataCount = (filteredData) => {
    setFilteredDataCount(filteredData.length);
  };

  const handlePause = async (item_uid) => {
    try {
      const data = { item_uid };
      const response = await subscriptionPause(data);

      toast.success(response?.data.message);
      // setPausedItems([...pausedItems, item_uid]);
      // Update local state (optimistic update)
      refetch();
    } catch (error) {
      toast.error(error?.response.data.message);
    }
  };

  const handleModal = (record, key = "qty") => {
    setChange((prev) => ({
      ...prev,
      modalData: record,
      ...(key === "qty" && {
        quantityModalOpen: !change?.quantityModalOpen,
        changedQty: 1,
      }),
      ...(key !== "qty" && {
        societyModalOpen: !change?.societyModalOpen,
        society: "",
        sector: "",
      }),
    }));
  };

  const handleSubmitChange = (key = "qty") => {
    const isFutureOrder = change?.for_future_order;
    let quantityPayload = {
      qty: change?.changedQty,
      item_uid: change?.modalData?.item_uid,
      ...(isFutureOrder && {
        for_future_order: change?.for_future_order,
      }),
    };

    let societyPayload = {
      item_uid: change?.modalData?.item_uid,
      sector: change?.sector,
      society: change?.society,
    };

    if (key !== "qty" && !societyPayload.sector) {
      return toast.error("Sector should be updated!");
    }

    if (key !== "qty" && !societyPayload.society) {
      return toast.error("Society should be updated!");
    }

    if (key === "qty" && quantityPayload.qty <= 0) {
      return toast.error("Updated quantity can't be less or equal to zero");
    }

    let apiFn =
      key == "qty"
        ? subscriptionQtyChange(quantityPayload)
        : subscriptionSocietyChange(societyPayload);

    apiFn
      .then((res) => {
        toast.success("Quantity changed successfully!");
        handleModal({}, key);
        refetch();
      })
      .catch((err) => {
        toast.error("Something went wrong! please try again...");
      });
  };

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
      // width: 100,
      render: (text) => text.substring(5), // Truncate the first 5 digits
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customer_name",
      key: "customer_name",
      width: 100,
      filters: totalCustomerNames.map((customerName) => ({
        text: customerName,
        value: customerName,
      })),

      filterSearch: true,
      onFilter: (value, record) => record.customer_name?.indexOf(value) === 0,
    },
    {
      title: "SOCIETY NAME",
      dataIndex: "society_name",
      key: "society_name",
      // width: 120,
      filters: uniqueSocietyNames.map((societyName) => ({
        text: societyName,
        value: societyName,
      })),
      filterSearch: true,
      onFilter: (value, record) => record?.society_name?.indexOf(value) == 0,
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

      filters: uniquePhoneNumbers.map((phoneNumber) => ({
        text: phoneNumber,
        value: phoneNumber,
      })),
      filterSearch: true,
      onFilter: (value, record) => record.phone_number?.indexOf(value) == 0,
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
      title: "UNIT QUANTITY",
      dataIndex: "unit_qty",
      key: "unit_qty",
    },
    {
      title: "QTY",
      dataIndex: "qty",
      key: "qty",
      width: 60,
    },
    {
      title: "AGENT NAME",
      dataIndex: "agent_name",
      key: "agent_name",
      filters: uniqueAgentNames?.map((agentName) => ({
        text: agentName === "" ? "" : agentName,
        value: agentName,
      })),
      // width: 120,
      filterSearch: true,
      onFilter: (value, record) => {
        if (value === "") {
          return record?.agent_name === "";
        }
        return record?.agent_name?.includes(value);
      },
    },
    {
      title: "DELIVERY ADDRESS",
      dataIndex: "delivery",
      key: "delivery",
      // ellipsis: true,
      width: 120,
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
      filterSearch: true,
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

    {
      title: "PAUSE ITEM",
      key: "item_uid",
      dataIndex: "item_uid",
      // width: 60,
      render: (item_uid, record) =>
        !record.del_time && (
          <button
            className="bg-[#DF4584] rounded-2xl text-white p-2"
            onClick={() => handlePause(item_uid)}
            // disabled={pausedItems.includes(item_uid)} // Disable button for paused items
          >
            Pause
          </button>
        ),
    },

    {
      title: "QTY CHANGE",
      key: "quantity_change",
      dataIndex: "quantity_change",
      render: (quantity_change, record) =>
        !record.del_time && (
          <button
            className="bg-[#DF4584] rounded-2xl text-white p-2"
            onClick={() => handleModal(record)}
          >
            Qty Change
          </button>
        ),
    },
    // {
    //   title: "SECTOR CHANGE",
    //   key: "sector_change",
    //   dataIndex: "sector_change",
    //   render: (sector_change, record) =>
    //     !record.del_time && (
    //       <button
    //         className="bg-[#DF4584] rounded-2xl text-white p-2"
    //         onClick={() => handleModal(record, "sector")}
    //       >
    //         Sector Change
    //       </button>
    //     ),
    // },
    // {
    //   title: "WALLET",
    //   dataIndex: "wallet_amount",
    //   key: "wallet_amount",
    //   width: 60,
    // },
  ];

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
    { length: Math.ceil(searchTotalCount || tableData?.totalCount / 50) },
    (_, index) => `${(index + 1) * 50}`
  );


  const handlePageSizeChange = (current, page) => {
    if (showSearchData) {
      setSearchSize(page);
      setIsQueryEnabled(true);
    } else {
      setSize(page);
      setShouldFetch(true);
    }
  };

  const handleChange = (pagination, filters, sorter) => {
    const nonEmptyFilters = {};
    Object.keys(filters).forEach((x) => {
      if (filters[x]?.length > 0) nonEmptyFilters[x] = filters[x];
    });

    setSelectedFilters(nonEmptyFilters);

    const filteredData = historyData?.filter((item) => {
      for (let key in nonEmptyFilters) {
        if (key === "agent_name") {
          const agentNames = item[key]
            ? item[key].split(",").map((name) => name.trim())
            : [""];
          if (
            !agentNames.some((agent) => nonEmptyFilters[key]?.includes(agent))
          ) {
            return false;
          }
        } else {
          if (!nonEmptyFilters[key]?.includes(item[key])) {
            return false;
          }
        }
      }
      return true;
    });

    handleFilteredDataCount(filteredData);
  };

  const handleQuantityOption = (option) => {
    setChange((prev) => ({
      ...prev,
      for_future_order: option,
    }));
  };

  const handleSearch = async () => {
    const searchValue = search;
    await SubscriptionSearch(currentPage, size, searchValue).then((res) => {
      setSearchData(res?.data);
      setSearchTotalCount(res?.totalCount || 0);
      setShowSearchData(true);
      setParam(search);
    });
  };

  const handleDownloadCsv = () => {
    setCsvLoader(true);
    downloadCsv()
      .then((res) => {
        setCsvLoader(false);
        const pdfUrl = res?.data?.file_url;
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "document.pdf"; // specify the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Successfully downloaded!");
      })
      .catch((err) => {
        setCsvLoader(false);
        toast.error("Failed, Please try again after sometime!");
      });
  };

  const handleCsvSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file[0]);
    csvUpload(formData)
      .then((res) => {
        toast.success(res?.data?.message);
        setCsvModalOpen(false);
      })
      .catch((err) => {
        toast.error("File upload failed!");
        setCsvModalOpen(false);
      });
  };

  const {
    quantityModalOpen,
    societyModalOpen,
    for_future_order: futureOrder,
    changedQty,
    modalData: {
      item_uid: itemUid,
      customer_name: custmerName,
      phone_number: phNumber,
      qty: customerQty,
      society_name: customerSocietyName,
      sectors: customerSector,
    },
    sector,
    society,
  } = change;

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
      <button
        className="bg-[#ff0000] text-white p-2 mr-2 rounded-lg relative top-2"
        onClick={() => reAssignAgent()}
      >
        Re-Assign Agents
      </button>
      <button
        onClick={handleDownloadCsv}
        disabled={csvLoader}
        className="bg-[#ff0000] text-white p-2 mr-2 rounded-lg relative top-2"
      >
        {csvLoader ? "Downloading..." : "Download All Data"}
      </button>
      <button
        className="bg-[#ff0000] text-white p-2 mr-2 rounded-lg relative top-2"
        onClick={() => {
          setCsvModalOpen(true);
        }}
      >
        CSV UPLOAD
      </button>
      <DataTable
        data={historyData}
        loading={isSearchLoading || isLoading}
        fileName="Subscription_Listing.csv"
        columns={HistoryHeaders}
        onChange={handleChange}
        // pagination={paginationConfig}
        onFilteredDataChange={handleFilteredDataCount}
        scroll={{
          y: "calc(100vh - 350px)",
        }}
        setSearch={setSearch}
        search={search}
        setSearchData={setSearchData}
        setShowSearchData={setShowSearchData}
        handleSearch={handleSearch}
      />
      <div className="flex justify-end px-4 py-2">
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
          pageSizeOptions={pageSizeOptions}
          onShowSizeChange={handlePageSizeChange}
          disabled={isLoading || isSearchLoading}
        />
      </div>
      <Modal
        open={csvModalOpen}
        onCancel={() => setCsvModalOpen(false)}
        footer={null}
        title="Upload Csv"
        centered
      >
        <form>
          <div className="flex flex-col">
            <input type="file" onChange={handleCsvUpload} />
            <button
              onClick={handleCsvSubmit}
              className="bg-[#ff0000] text-white p-2 mr-2 rounded-lg relative top-2"
            >
              Upload
            </button>
          </div>
        </form>
      </Modal>
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
      <Modal
        style={{
          fontFamily: "Fredoka, sans-serif",
        }}
        title="Quantity Change Modal"
        titleColor="#9c29c1"
        open={quantityModalOpen}
        onCancel={() => handleModal({}, "qty")}
        width={700}
        // height={700}
        okText="Submit"
        onOk={() => handleSubmitChange("qty")}
        centered
      >
        <div>
          <span>Item uid:</span>
          <span className="font-bold ml-2">{itemUid}</span>
        </div>
        <div>
          <span>Customer Name:</span>
          <span className="font-bold ml-2">{custmerName}</span>
        </div>
        <div>
          <span>Customer Phone Number:</span>
          <span className="font-bold ml-2">{phNumber}</span>
        </div>
        <div className="font-bold text-lg mt-3 text-[#df4584]">
          Please select one option
        </div>
        <div className="flex flex-col">
          <label>
            <input
              type="checkbox"
              onChange={() => handleQuantityOption(false)}
              checked={futureOrder === false}
              value="Only for current order"
            />
            <span className="ml-3">Only for current order</span>
          </label>
          <label>
            <input
              type="checkbox"
              onChange={() => handleQuantityOption(true)}
              checked={futureOrder === true}
              value="For all current and future orders"
            />
            <span className="ml-3">For all current and future orders</span>
          </label>
        </div>
        <div className="mt-3 flex space-x-5">
          <div className="flex space-x-3">
            <div>Current Quantity:</div>
            <div className="border-2 w-36 text-center">{customerQty}</div>
          </div>
          <div className="flex space-x-3">
            <div>New Quantity:</div>
            <div className="border-2  text-center">
              <input
                type="number"
                className="text-center"
                value={changedQty}
                min={1}
                onChange={(e) =>
                  setChange((prev) => ({
                    ...prev,
                    changedQty: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>
      </Modal>
      {/* <Modal
        style={{
          fontFamily: "Fredoka, sans-serif",
        }}
        title="Sector-Society Update Modal"
        titleColor="#9c29c1"
        open={societyModalOpen}
        onCancel={() => handleModal({}, "society")}
        width={700}
        // height={700}
        okText="Submit"
        onOk={() => handleSubmitChange("society")}
        centered
      >
        <div>
          <span>Item uid:</span>
          <span className="font-bold ml-2">{itemUid}</span>
        </div>
        <div>
          <span>Customer Name:</span>
          <span className="font-bold ml-2">{custmerName}</span>
        </div>
        <div>
          <span>Customer Phone Number:</span>
          <span className="font-bold ml-2">{phNumber}</span>
        </div>
        <div className="font-bold text-lg mt-3 text-[#df4584]">
          Please update Sector and Society
        </div>
        <div className="mt-3 flex space-x-5">
          <div className="flex space-x-3">
            <div>Current Sector:</div>
            <div className="border-2 w-36 text-center">{customerSector}</div>
          </div>
          <div className="flex space-x-3">
            <div>Updated Sector:</div>
            <div className="border-2  text-center">
              <input
                type="text"
                className="text-center"
                value={sector}
                min={1}
                onChange={(e) =>
                  setChange((prev) => ({
                    ...prev,
                    sector: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>
        <div className="mt-3 flex space-x-5">
          <div className="flex space-x-3">
            <div>Current Society:</div>
            <div className="border-2 w-36 text-center">
              {customerSocietyName}
            </div>
          </div>
          <div className="flex space-x-3">
            <div>Updated Society:</div>
            <div className="border-2  text-center">
              <input
                type="text"
                className="text-center"
                value={society}
                min={1}
                onChange={(e) =>
                  setChange((prev) => ({
                    ...prev,
                    society: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>
      </Modal> */}
    </div>
  );
};

export default ListingPage;
