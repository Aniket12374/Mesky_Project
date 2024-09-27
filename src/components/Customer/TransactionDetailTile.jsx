import React, { useEffect, useState } from "react";
import { transactionName } from "../../utils";
import moment from "moment/moment";
import { getTransactionDetail } from "../../services/customerOrders/CustomerOrderService";

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
    "Added/Deducted/Refund Amount": (
      <div className='text-xl font-bold'>₹ {data?.transaction_amount}</div>
    ),
    "Wallet Closing Balance": `₹ ${data?.current_amount}`,
    "Transactional Id": data?.id,
    "Payment Mode": data?.payment_mode,
    Status: data?.transaction_status,
  };
  return (
    <div className='transaction-detail-tile m-3 flex flex-col justify-center'>
      <div>
        <button
          className='rounded-full border-2 border-gray-400 w-8 h-8 flex justify-center items-center'
          onClick={() => setTransactionId(null)}
        >
          <i className='fa-sharp fa-solid fa-arrow-left text-2xl'></i>
        </button>
      </div>
      <div className='mt-10 ml-3 font-semibold text-lg'>
        {transactionName(data)}
      </div>
      <div className='ml-3 mt-2 text-sm gray-color'>
        {moment(data?.created_date, "DD-MM-YYYY hh:mm").format("lll")}
      </div>

      <div className='border-2 border-gray-200 m-3 mt-5 p-3 rounded-lg'>
        {Object.keys(details).map((detail) => (
          <div className='flex justify-between' key={detail}>
            <div className='gray-color'>{detail}</div>
            <div>{details[detail]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionDetailTile;
