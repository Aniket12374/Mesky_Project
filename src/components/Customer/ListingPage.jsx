import { useState } from "react";
import { Pagination, Modal, message } from "antd";
import DataTable from "../Common/DataTable/DataTable";
import {
  customerSearchService,
  customerWalletTopUp,
} from "../../services/customer/customerService";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import Cookies from "js-cookie";

const ListingPage = () => {
  const [search, setSearch] = useState("");
  const [change, setChange] = useState({
    creditModalOpen: false,
    customerName: "",
    customerId: "",
    creditAmount: "",
    transactionId: "",
    razorpayPaymentId: "",
    razorpayOrderId: "",
    totalCount: 0,
    currentPage: 1,
    size: 10,
    isQueryEnabled: false,
  });

  const {
    creditModalOpen,
    customerName: customer_name,
    creditAmount,
    customerId,
    razorpayOrderId,
    razorpayPaymentId,
    transactionId,
    totalCount,
    currentPage,
    size,
    isQueryEnabled,
  } = change;

  const isCreditUser = Cookies.get("creditUser");

  const {
    data: searchResult,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useQuery(
    ["customerSearchService", search, currentPage, size],
    () => customerSearchService(search, currentPage, size),
    {
      enabled: isQueryEnabled,
      onSuccess: (res) => {
        setChange((prevState) => ({
          ...prevState,
          isQueryEnabled: false,
          totalCount: res?.data.totalCount || 0,
        }));
        setSearchData(res?.data || []);
      },
    }
  );

  let tableData = searchResult?.data || [];

  let historyData =
    tableData?.data?.map((listingData) => ({
      customer_id: listingData?.id,
      Active_Status: listingData?.active_status,
      mobileNumber: listingData?.default_mobile_number,
      customer_name: `${listingData?.first_name} ${listingData?.last_name}`,
    })) || [];

  const handleModal = (record) => {
    setChange((prev) => ({
      ...prev,
      customerName: record?.customer_name,
      customerId: record?.customer_id,
      creditModalOpen: !creditModalOpen,
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
            Active_Status ? "text-[#32CD32]" : "text-[#FFA500]"
          } flex ml-4 font-medium`}
        >
          {Active_Status ? "Active" : "Not available"}
        </div>
      ),
    },
  ];

  if (isCreditUser == "true") {
    HistoryHeaders.push({
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
    });
  }

  const handleSearch = () => {
    setChange((prev) => ({
      ...prev,
      currentPage: 1,
      isQueryEnabled: true,
    }));
  };

  const pageSizeOptions = ["10", "20", "50", "100"];

  const handlePageChange = (page) => {
    setChange((prev) => ({
      ...prev,
      currentPage: page,
      isQueryEnabled: true,
    }));
  };

  const handlePageSizeChange = (current, size) => {
    setChange((prev) => ({
      ...prev,
      size,
      currentPage: 1, // Reset to first page when size changes
      isQueryEnabled: true,
    }));
  };

  const handleSubmitChange = async () => {
    if (creditAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const data = {
      customer_id: customerId,
      transaction_amount: creditAmount,
      transaction_id: transactionId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_order_id: razorpayOrderId,
    };

    try {
      const response = await customerWalletTopUp(data);

      if (response?.data) {
        setChange((prevState) => ({
          ...prevState,
          creditModalOpen: false,
          creditAmount: "",
          razorpayOrderId: "",
          razorpayPaymentId: "",
          transactionId: "",
        }));
        toast.success(response?.data.message);
      } else {
        toast.error(
          response?.data.message || "Transaction failed: Please try later"
        );
      }
    } catch (error) {
      console.error("Error during transaction:", error);
      toast.error("Server Error");
    }
  };

  return (
    <div>
      <style>
        {`
        .ant-table-thead th {
          vertical-align: bottom;
        }
      `}
      </style>
      <div className="flex justify-end px-12 font-semibold">
        Total Data Count: {search ? totalCount : "0"}
      </div>
      <DataTable
        data={historyData}
        columns={HistoryHeaders}
        scroll={{ y: "calc(100vh - 350px)" }}
        setSearch={setSearch}
        search={search}
        // setSearchData={setSearchData}
        handleSearch={handleSearch}
      />
      {search && (
        <div className="flex justify-end px-4 py-2">
          <Pagination
            current={currentPage}
            total={totalCount}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} items`
            }
            onChange={handlePageChange}
            showSizeChanger={true}
            pageSizeOptions={pageSizeOptions}
            onShowSizeChange={handlePageSizeChange}
            disabled={isSearchLoading}
          />
        </div>
      )}
      <Modal
        style={{
          fontFamily: "Fredoka, sans-serif",
        }}
        title="Customer Credit Modal"
        titleColor="#9c29c1"
        open={creditModalOpen}
        onCancel={() => handleModal({ creditModalOpen: false })}
        width={700}
        okText="Submit"
        onOk={handleSubmitChange}
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
                value={creditAmount}
                onChange={(e) =>
                  setChange((prev) => ({
                    ...prev,
                    creditAmount: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="flex space-x-3 w-[50%] justify-between">
            <div className="font-semibold">razorpay paymentId :</div>
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
          <div className="flex space-x-3 w-[50%] justify-between">
            <div className="font-semibold">transaction id :</div>
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
          <div className="flex space-x-3 justify-between w-[50%]">
            <div className="font-semibold">razorpay orderId :</div>
            <div className="border-2  text-center">
              <input
                type="text"
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
