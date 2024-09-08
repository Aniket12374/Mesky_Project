import React, { useEffect, useState } from "react";
import { Header, IconGreen, transactionName } from "../../utils";
import CustomerPopup from "../Common/CustomerPopup";
import {
  getOrders,
  getTransactionDetail,
  getTransactions,
} from "../../services/customerOrders/CustomerOrderService";
import DataTable from "../Common/DataTable/DataTable";
import moment from "moment";
import { OrderDetails } from "./OrderDetails";
import { useQuery } from "react-query";
import { Pagination } from "antd";
import CustomerFilters, { AppliedFilters } from "./CustomerFilters";
import TransactionDetailTile from "./TransactionDetailTile";

function Transactions({ showSearch = true, filters = {}, showBorder = true }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionId, setTransactionId] = useState(null);
  const [finalFilters, setFinalFilters] = useState(filters);
  const [debitData, setDebitData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [shouldFetch, setShouldFetch] = useState(true);

  const closeModal = () => setModalOpen((prev) => !prev);

  const { isLoading: isSearchLoading } = useQuery(
    ["getTransactions", currentPage, size, finalFilters],
    () => getTransactions(currentPage, size, finalFilters),
    {
      enabled: shouldFetch,
      keepPreviousData: true,
      onSuccess: (data) => {
        setShouldFetch(false);
        setTransactions(data?.data?.transactions);
        setTotalCount(data?.data?.total_count);
      },
    }
  );

  const getDebitData = (debitId) => {
    getOrders(1, 1, { search_value: debitId, search_type: "order_id" })
      .then((res) => {
        setDebitData(res?.data?.order_details[0]);
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const transactionHeaders = [
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      width: 50,
      render: (_, record) => {
        const type = record?.type;
        const isCreditTransaction = type === "CREDIT" || type === "REFUND";
        return !isCreditTransaction ? (
          <IconGreen icon='-' />
        ) : (
          <IconGreen icon='+' />
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
      width: 100,
      render: (_, record) => `₹ ${record?.transaction_amount}`,
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setShouldFetch(true);
  };

  const removeFilter = (key) => {
    let modifiedFilters = {};
    Object.keys(finalFilters)
      .filter((x) => x !== key)
      .forEach((x, index) => {
        modifiedFilters[x] = finalFilters[x];
      });

    setFinalFilters(modifiedFilters);
    setShouldFetch(true);
  };

  const pageSizeOptions = ["10", "20", "50", "100", "250", "500"];

  const handlePageSizeChange = (current, page) => {
    setSize(page);
    setCurrentPage(1);
    setShouldFetch(true);
  };

  return (
    <div className={!showBorder ? "" : "w-1/3 border-2 border-gray-200"}>
      <div className='flex flex-wrap'>
        <Header text='Transactions' className='m-2' />
        {showSearch && (
          <div className='flex space-x-2'>
            <button onClick={() => setModalOpen(true)} className='search-btn'>
              Search
            </button>
            <button className='search-btn' onClick={() => setFinalFilters({})}>
              Clear
            </button>
          </div>
        )}
      </div>
      <AppliedFilters removeFilter={removeFilter} finalFilters={finalFilters} />
      {modalOpen && (
        <CustomerFilters
          open={modalOpen}
          closeModal={closeModal}
          options={"TransactionsOptions"}
          modal={"transaction"}
          setFinalFilters={setFinalFilters}
          finalFilters={finalFilters}
          setShouldFetch={setShouldFetch}
        />
      )}
      {transactionId === null ? (
        debitData ? (
          <OrderDetails
            data={debitData}
            closeOrderModal={() => setTransactionId(null)}
          />
        ) : (
          <>
            <div className='h-[80vh] overflow-auto transaction-list'>
              <DataTable
                columns={transactionHeaders}
                data={transactions}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: () =>
                      record.type === "DEBIT"
                        ? getDebitData(record?.order_id)
                        : setTransactionId(record?.id),
                  };
                }}
                loading={isSearchLoading}
                scroll={{
                  ...(!showSearch && { y: 450 }),
                }}
                showExport={false}
                showHeader={false}
              />
            </div>
            <div className='flex justify-end px-4 py-2 transaction-pagination'>
              <Pagination
                current={currentPage}
                total={totalCount}
                showTotal={(total, range) => (
                  <div>
                    {range[0]} - {range[1]} of {totalCount} items
                  </div>
                )}
                onChange={handlePageChange}
                showSizeChanger={true}
                pageSizeOptions={pageSizeOptions}
                onShowSizeChange={handlePageSizeChange}
                disabled={isSearchLoading}
              />
            </div>
          </>
        )
      ) : (
        <>
          <TransactionDetailTile
            transactionId={transactionId}
            setTransactionId={setTransactionId}
          />
        </>
      )}

      {/* <CustomerPopup
        open={modalOpen}
        closeModal={closeModal}
        options={"TransactionsOptions"}
        modal={"transaction"}
        setFinalFilters={setFinalFilters}
      /> */}
    </div>
  );
}

export default Transactions;
