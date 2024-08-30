import React, { useState } from "react";
import { Input, Modal, Select } from "antd";
import moment from "moment";

const TransactionsOptions = {
  None: "none",
  "Transaction Value": "transaction_value",
  Credit: "credit",
  Debit: "debit",
  "Wallet Recharges": "wallet_recharges",
  "Offers & Promotions": "offers",
  "Promotional Products": "promotional",
  Refunds: "refund",
};

const OrderOptions = {
  "Product Name": "none",
  "Order Value": "order_value",
  "Order Id": "order_id",
  "Promotional Products": "promotional_products",
  "Item Id": "item_id",
};

function CustomerPopup({
  open,
  closeModal,
  modal = "transaction",
  setFinalFilters,
}) {
  const isTransactionalModal = modal == "transaction";
  const dropDownSelection = isTransactionalModal
    ? TransactionsOptions
    : OrderOptions;
  const dropDownOptions = Object.keys(dropDownSelection).map((option) => ({
    label: option,
    value: dropDownSelection[option],
  }));
  const [filters, setFilters] = useState({
    q: "",
    start_date: "",
    end_date: "",
    transaction_type: "",
    amount: "",
  });

  const [optionSelected, setOptionSelected] = useState();

  const onChangeOption = (value) => {
    const option = dropDownOptions.find((x) => x.value === value);
    setOptionSelected(option);
    setFilters((prev) => ({
      ...prev,
      transaction_type: value,
    }));
  };

  const onChangeHandler = (e, key) => {
    let value = e.target.value;
    if (key !== "amount") {
      value = moment(value, "YYYY-MM-DD").format("DD-MM-YYYY");
    } else {
      value = Number(value);
    }
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // console.log({ filters });

  return (
    <Modal
      className='fredoka-400'
      centered
      width={700}
      open={open}
      onCancel={() => {
        closeModal();
        setFilters({});
      }}
      footer={
        <button
          className='orange-btn'
          onClick={() => {
            setFinalFilters(filters);
            closeModal();
          }}
        >
          + Search
        </button>
      }
    >
      <div>
        <div>Search By</div>
        {modal == "transaction" && (
          <div className='mt-2'>
            <input
              type='text'
              placeholder='Search by free text'
              className='border-b-2 border-gray-300 w-full'
            />
          </div>
        )}
        <div className='flex items-center space-x-5 my-5'>
          <span>{isTransactionalModal ? "Date Between" : "Delivery Date"}</span>
          <Input
            type='date'
            placeholder='Start-Date'
            name='start_date'
            className='w-64'
            onChange={(e) => onChangeHandler(e, "start_date")}
          />
          <Input
            type='date'
            placeholder='End-Date'
            name='end_date'
            className='w-64'
            onChange={(e) => onChangeHandler(e, "end_date")}
          />
        </div>
        <div className='flex items-center space-x-5'>
          <span>Search By</span>
          <Select
            className='w-64'
            options={dropDownOptions}
            onChange={onChangeOption}
            placeholder='Select one option'
            value={optionSelected}
          />
          <Input
            type='number'
            className='border-b-2 border-gray-300 w-64'
            placeholder='Amount'
            onChange={(e) => onChangeHandler(e, "amount")}
          />
        </div>
      </div>
    </Modal>
  );
}

export default CustomerPopup;
