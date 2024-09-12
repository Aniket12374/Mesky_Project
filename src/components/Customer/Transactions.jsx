import React, { useEffect, useState } from "react";
import { Header, IconGreen, transactionName } from "../../utils";
import CustomerPopup from "../Common/CustomerPopup";
import { AudioOutlined } from "@ant-design/icons";
import {
  getOrders,
  getTransactionDetail,
  getTransactions,
} from "../../services/customerOrders/CustomerOrderService";
import DataTable from "../Common/DataTable/DataTable";
import moment from "moment";
import { OrderDetails } from "./OrderDetails";
import { useQuery } from "react-query";
import { Input, Pagination, Table } from "antd";
import CustomerFilters, { AppliedFilters } from "./CustomerFilters";
import TransactionDetailTile from "./TransactionDetailTile";
import { OrderTnxHeader } from "./CustomerConstants";

function Transactions({
  showSearch = true,
  filters = {},
  showBorder = true,
  name,
  token = "",
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionId, setTransactionId] = useState(null);
  const [finalFilters, setFinalFilters] = useState(filters);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [debitData, setDebitData] = useState(null);
  const [address, setAddress] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [copied, setCopied] = useState(false);

  const closeModal = () => setModalOpen((prev) => !prev);

  const { isLoading: isSearchLoading, refetch } = useQuery(
    [`getTransactions_${token}`, currentPage, size, finalFilters, token],
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

  useEffect(() => {
    refetch();
  }, [token]);

  const getDebitData = (debitId) => {
    getOrders(1, 1, { search_value: debitId, search_type: "order_id" })
      .then((res) => {
        setDebitData(res?.data?.order_details[0]);
        setAddress(res?.data?.address_info);
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const clickHandler = (record) => {
    return !copied
      ? !name
        ? record.type === "DEBIT"
          ? getDebitData(record?.order_id?.split("-")[1])
          : setTransactionId(record?.id)
        : null
      : null;
  };

  const transactionHeaders = [
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      width: "10%",
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
      width: "60%",
      render: (_, record) => {
        const date = record?.created_date?.split(" ");
        return (
          <div className='text-sm'>
            <div>{transactionName(record)}</div>
            <div className='text-xs gray-color'>
              {moment(date[0], "DD-MM-YYYY").format("ll")}
            </div>
          </div>
        );
      },
    },
    {
      title: "Transaction Amount",
      dataIndex: "amount",
      key: "amount",
      width: "20%",
      render: (_, record) => (
        <div className={record?.type === "DEBIT" ? "" : "text-[#008000]"}>
          {record?.type === "DEBIT" ? "-" : "+"}
          <span className='ml-1'>₹ {record?.transaction_amount}</span>
        </div>
      ),
    },
    {
      title: "icon redirect",
      dataIndex: "icon-redirect",
      key: "icon-redirect",
      width: "5%",
      render: (_, record) =>
        !name && (
          <div className='text-[#beb8b8] text-[13px]'>
            <i class='fa-solid fa-chevron-right'></i>
          </div>
        ),
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setShouldFetch(true);
  };

  const removeFilter = (key) => {
    let modifiedFilters = {};
    Object.keys(appliedFilters)
      .filter((x) => x !== key)
      .forEach((x, index) => {
        modifiedFilters[x] = appliedFilters[x];
      });

    setFinalFilters(modifiedFilters);
    setAppliedFilters(modifiedFilters);
    setShouldFetch(true);
  };

  const handleClear = () => {
    setFinalFilters({});
    setAppliedFilters({});
    setModalOpen(false);
    setShouldFetch(true);
  };

  const pageSizeOptions = ["10", "20", "50", "100", "250", "500"];

  const handlePageSizeChange = (current, page) => {
    setSize(page);
    setCurrentPage(1);
    setShouldFetch(true);
  };

  const trnxTileClassName = modalOpen
    ? "h-[200px] overflow-y-auto transaction-list"
    : "h-[400px] overflow-y-auto transaction-list";

  return (
    <div className={!showBorder ? "" : "w-1/3 border-2 border-gray-200"}>
      <OrderTnxHeader
        showSearch={showSearch}
        name={name}
        setModalOpen={setModalOpen}
        placeholder={"Search by amount, transaction type.."}
      />

      {showSearch && (
        <CustomerFilters
          open={modalOpen}
          closeModal={closeModal}
          options={"TransactionsOptions"}
          modal={"transaction"}
          setFinalFilters={setFinalFilters}
          finalFilters={finalFilters}
          setShouldFetch={setShouldFetch}
          setAppliedFilters={setAppliedFilters}
          appliedFilters={appliedFilters}
          removeFilter={removeFilter}
          clear={handleClear}
        />
      )}

      {transactionId === null ? (
        debitData ? (
          <div className={trnxTileClassName}>
            <OrderDetails
              data={debitData}
              address={address}
              closeOrderModal={() => {
                setTransactionId(null);
                setDebitData(null);
              }}
            />
          </div>
        ) : (
          <>
            <div className={trnxTileClassName}>
              <Table
                columns={transactionHeaders}
                dataSource={transactions}
                onRow={(record) => ({
                  onClick: () => clickHandler(record),
                  onKeyDown: (event) => setCopied(true),
                  onMouseDown: (event) => setCopied(false),
                  onMouseLeave: (event) => setCopied(false),
                  tabIndex: 0, // Make row focusable
                })}
                loading={isSearchLoading}
                scroll={{
                  ...(!showSearch && { y: 500 }),
                }}
                showExport={false}
                showHeader={false}
              />
            </div>
            {showSearch && (
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
            )}
          </>
        )
      ) : (
        <div className={trnxTileClassName}>
          <TransactionDetailTile
            transactionId={transactionId}
            setTransactionId={setTransactionId}
          />
        </div>
      )}
    </div>
  );
}

export default Transactions;
