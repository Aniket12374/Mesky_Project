import React, { useEffect, useState } from "react";
import { Header, IconGreen, transactionName } from "../../utils";
import CustomerPopup from "../Common/CustomerPopup";
import {
  getTransactionDetail,
  getTransactions,
} from "../../services/customerOrders/CustomerOrderService";
import DataTable from "../Common/DataTable/DataTable";
import moment from "moment";
import { useQuery } from "react-query";
import { Pagination } from "antd";

function Transactions({ showSearch = true, filters = {}, showBorder = true }) {
  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = () => setModalOpen((prev) => !prev);
  const [transactions, setTransactions] = useState([]);
  const [transactionId, setTransactionId] = useState(null);
  const [finalFilters, setFinalFilters] = useState(filters);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch transactions whenever page or size changes
  const { isLoading: isSearchLoading } = useQuery(
    ["getTransactions", currentPage, size, finalFilters],
    () => getTransactions(currentPage, size, finalFilters),
    {
      keepPreviousData: true, // This keeps the old data until the new one arrives
      onSuccess: (data) => {
        setTransactions(data?.data?.transactions);
        setTotalCount(data?.data?.total_count);
      },
    }
  );

  // useEffect(() => {
  //   getTransactions(0, 10, finalFilters)
  //     .then((res) => {
  //       setTransactions(res?.data?.transactions);
  //       setTotalCount(res?.data?.total_count);
  //     })
  //     .catch((err) => console.log({ err }));
  // }, [finalFilters]);

  const transactionHeaders = [
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      render: (_, record) => {
        const type = record?.type;
        const isCreditTransaction = type === "CREDIT" || type === "REFUND";
        return !isCreditTransaction ? (
          <IconGreen icon="-" />
        ) : (
          <IconGreen icon="+" />
        );
      },
    },
    {
      title: "Transaction Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return transactionName(record);
      },
    },
    {
      title: "Transaction Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_, record) => `₹ ${record?.transaction_amount}`,
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const pageSizeOptions = ["10", "20", "50", "100", "250", "500"];


  // const pageSizeOptions = Array.from(
  //   { length: Math.ceil(totalCount / 50) },
  //   (_, index) => `${(index + 1) * 50}`
  // );

  const handlePageSizeChange = (current, page) => {
    setSize(page);
    setCurrentPage(1);
  };

  return (
    <div className={!showBorder ? "" : "w-1/3 border-2 border-gray-200 rounded-md"}>
      <div className="flex px-1 py-2">
        <Header text="Transactions" />
        {showSearch && (
          <>
            <input
              type="text"
              onClick={() => setModalOpen(true)}
              onChange={closeModal}
              className="border-b-2 border-gray-300 w-32 ml-10 focus:outline-none"
              placeholder="Search"
            />
            <button className="orange-btn" onClick={() => setFinalFilters({})}>
              Clear
            </button>
          </>
        )}
      </div>
      {transactionId === null ? (
        <>
          <div className="h-[80vh] overflow-auto">
            <DataTable
              columns={transactionHeaders}
              data={transactions}
              onRow={(record, rowIndex) => {
                return { onClick: () => setTransactionId(record?.id) };
              }}
              loading={isSearchLoading}
              scroll={{
                ...(!showSearch && { y: 450 }),
              }}
              showExport={false}
              showHeader={false}
            />
          </div>
          <div className="flex justify-end px-4 py-2">
            <Pagination
              current={currentPage}
              total={totalCount}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${totalCount} items`
              }
              onChange={handlePageChange}
              showSizeChanger={true}
              pageSizeOptions={pageSizeOptions}
              onShowSizeChange={handlePageSizeChange}
              disabled={isSearchLoading}
            />
          </div>
        </>
      ) : (
        <>
          <TransactionDetailTile
            transactionId={transactionId}
            setTransactionId={setTransactionId}
          />
        </>
      )}

      <CustomerPopup
        open={modalOpen}
        closeModal={closeModal}
        options={"TransactionsOptions"}
        modal={"transaction"}
        setFinalFilters={setFinalFilters}
      />
    </div>
  );
}

const TransactionDetailTile = ({ transactionId, setTransactionId }) => {
  const [data, setData] = useState({});
  useEffect(() => {
    getTransactionDetail(transactionId)
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => {
        console.log({ err });
      });
  }, [transactionId]);

  const details = {
    "Added/Deducted/Refund Amount": data?.transaction_amount,
    "Wallet Closing Balance": data?.current_amount,
    "Transactional Id": data?.id,
    "Payment Mode": data?.payment_mode,
    Status: data?.transaction_status,
  };
  return (
    <div className="m-3 flex flex-col justify-center">
      <div>
        <button
          className="p-2 w-8 h-8 flex rounded-full border-2 border-gray-400"
          onClick={() => setTransactionId(null)}
        >
          <i
            className="fa fa-long-arrow-left text-sm rounded-full"
            aria-hidden="true"
          ></i>
        </button>
      </div>
      <div className="mt-10 ml-3">{transactionName(data)}</div>
      <div className="ml-3">
        {moment(data?.created_date, "DD-MM-YYYY hh:mm").format("lll")}
      </div>

      <div className="border-2 border-gray-200 m-3 p-3 rounded-lg">
        {Object.keys(details).map((detail) => (
          <div className="flex justify-between" key={detail}>
            <div>{detail}</div>
            <div>{details[detail]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactions;
