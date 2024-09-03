import { useState } from "react";
import { Pagination, Modal } from "antd";
import DataTable from "../Common/DataTable/DataTable";
import { customerSearchService } from "../../services/customer/customerService";

const ListingPage = () => {
  const [search, setSearch] = useState("");
  console.log("search", search);
  const [searchData, setSearchData] = useState([]);
  console.log("searchData", searchData);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [change, setChange] = useState({
    quantityModalOpen: false,
    customerName: "",
    transactionId: "",
    razorpayPaymentId: "",
    razorpayOrderId: "",
    isLoading: false,
  });
  console.log("quantityModalOpen", change?.quantityModalOpen);

  let tableData = searchData;
  let historyData = [];
  tableData?.data?.map((listingData) => {
    historyData.push({
      customer_id: listingData?.id,
      Active_Status: listingData?.active_status,
      mobileNumber: listingData?.default_mobile_number,
      customer_name: listingData?.first_name + listingData?.last_name,
    });
  });
  console.log("historyData", historyData);

  const handleModal = (record) => {
    console.log("record", record);
    setChange((prev) => ({
      ...prev,
      customerName: record?.customer_name,
      quantityModalOpen: !change?.quantityModalOpen,
    }));
  };

  const HistoryHeaders = [
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
    },
    {
      title: "Active Status",
      dataIndex: "Active_Status",
      key: "Active_Status",
      render: (Active_Status) => (
        <div
          className={`${
            Active_Status == true ? "text-[#32CD32]" : "text-[#FFA500]"
          } flex ml-4 font-medium`}
        >
          {Active_Status == true ? "Active" : "Not available"}
        </div>
      ),
    },
    {
      title: "CREDIT",
      key: "credit",
      dataIndex: "credit",
      render: (credit, record) => (
        <button
          className="bg-[#DF4584] rounded-2xl text-white p-2"
          onClick={() => handleModal(record)}
        >
          Credit
        </button>
      ),
    },
  ];

  const handleSearch = async () => {
    const searchValue = search;
    await customerSearchService(searchValue).then((res) => {
      setSearchData(res?.data);
      setSearchTotalCount(res?.totalCount || 0);
      setParam(search);
    });
  };

  const {
    quantityModalOpen,
    customerName: customer_name,
    razorpayOrderId,
    razorpayPaymentId,
    transactionId,
    isLoading,
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
      <DataTable
        data={historyData}
        // loading={isLoading}
        fileName="Subscription_Listing.csv"
        columns={HistoryHeaders}
        // onChange={handleChange}
        // pagination={paginationConfig}
        scroll={{
          y: "calc(100vh - 350px)",
        }}
        setSearch={setSearch}
        search={search}
        setSearchData={setSearchData}
        handleSearch={handleSearch}
      />
      {/* <div className="flex justify-end px-4 py-2">
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
      </div> */}
      <Modal
        style={{
          fontFamily: "Fredoka, sans-serif",
        }}
        title="Customer Credit Modal"
        titleColor="#9c29c1"
        open={quantityModalOpen}
        onCancel={() => handleModal({}, "qty")}
        width={700}
        okText="Submit"
        onOk={() => handleSubmitChange("qty")}
        centered
      >
        <div className="w-[40%] flex justify-between py-2">
          <span className="font-semibold">Customer Name:</span>
          <span className="font-bold ml-2">{customer_name}</span>
        </div>
        <div className="space-y-2">
          <div className="flex space-x-3 w-[50%] justify-between">
            <div className="font-semibold">Transaction Amount :</div>
            <div className="border-2  text-center">
              <input
                type="text"
                className="text-center border-2 rounded-md  border-black"
                value={transactionId}
                onChange={(e) =>
                  setChange((prev) => ({
                    ...prev,
                    transactionId: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="flex space-x-3 w-[50%] justify-between">
            <div className="font-semibold">razorpay_payment_id :</div>
            <div className="border-2  text-center">
              <input
                type="text"
                className="text-center border-2 rounded-md  border-black"
                value={razorpayPaymentId}
                onChange={(e) =>
                  setChange((prev) => ({
                    ...prev,
                    razorpayPaymentId: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="flex space-x-3 justify-between w-[50%]">
            <div className="font-semibold">razorpay_order_id :</div>
            <div className="border-2  text-center">
              <input
                type="number"
                className="text-center border-2 rounded-md  border-black"
                value={razorpayOrderId}
                onChange={(e) =>
                  setChange((prev) => ({
                    ...prev,
                    razorpayOrderId: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ListingPage;
