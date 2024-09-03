import React, { useEffect, useState } from "react";
import { Header, IconGreen, transactionName } from "../../utils";
import CustomerPopup from "../Common/CustomerPopup";
import {
  getTransactionDetail,
  getTransactions,
} from "../../services/customerOrders/CustomerOrderService";
import DataTable from "../Common/DataTable/DataTable";
import { useNavigate } from "react-router-dom";
import moment from "moment";

function Transactions({ showSearch = true, filters = {}, showBorder = true }) {
  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = () => setModalOpen((prev) => !prev);
  const [transactions, setTransactions] = useState([]);
  const [transactionId, setTransactionId] = useState(null);
  const [finalFilters, setFinalFilters] = useState(filters);

  useEffect(() => {
    getTransactions(0, 10, finalFilters)
      .then((res) => {
        setTransactions(res?.data?.transactions);
      })
      .catch((err) => console.log({ err }));
  }, [finalFilters]);

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

  return (
    <div className={!showBorder ? "" : "w-1/3 border-2 border-gray-200"}>
      <div className='flex'>
        <Header text='Transactions' className='m-2' />
        {showSearch && (
          <>
            {" "}
            <input
              type='text'
              onClick={() => setModalOpen(true)}
              onChange={closeModal}
              className='border-b-2 border-gray-300 w-32 ml-10 focus:outline-none'
              placeholder='Search'
            />
            <button className='orange-btn' onClick={() => setFinalFilters({})}>
              Clear
            </button>
          </>
        )}
      </div>
      {transactionId === null ? (
        <DataTable
          columns={transactionHeaders}
          data={transactions}
          // onClick={() => }
          onRow={(record, rowIndex) => {
            return { onClick: (event) => setTransactionId(record?.id) };
          }}
          loading={false}
          scroll={{
            ...(!showSearch && { y: 450 }),
          }}
          showExport={false}
          showHeader={false}
        />
      ) : (
        <TransactionDetailTile
          transactionId={transactionId}
          setTransactionId={setTransactionId}
        />
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
        console.log({ res });
        setData(res?.data);
      })
      .catch((err) => {
        console.log({ err });
      });
  }, []);

  const details = {
    "Added/Deducted/Refund Amount": data?.transaction_amount,
    "Wallet Closing Balance": data?.current_amount,
    "Transactional Id": data?.id,
    "Payment Mode": data?.payment_mode,
    Status: data?.transaction_status,
  };
  return (
    <div className='m-3 flex flex-col justify-center'>
      <div>
        <button
          className='p-2 w-8 h-8 flex rounded-full border-2 border-gray-400'
          onClick={() => setTransactionId(null)}
        >
          <i
            class='fa fa-long-arrow-left text-sm rounded-full'
            aria-hidden='true'
          ></i>
        </button>
      </div>
      <div className='mt-10 ml-3'>{transactionName(data)}</div>
      <div className='ml-3'>
        {moment(data?.created_date, "DD-MM-YYYY hh:mm").format("lll")}
      </div>

      <div className='border-2 border-gray-200 m-3 p-3 rounded-lg'>
        {Object.keys(details).map((detail) => (
          <div className='flex justify-between'>
            <div>{detail}</div>
            <div>{details[detail]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactions;
