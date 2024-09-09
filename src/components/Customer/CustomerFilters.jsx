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

function CustomerFilters({
  open,
  closeModal,
  modal = "transaction",
  setFinalFilters,
  setShouldFetch,
  finalFilters,
}) {
  const normalFilters =
    Object.keys(finalFilters).length > 0
      ? finalFilters
      : {
          is_csd: true,
        };
  const isTnlModal = modal == "transaction";
  const dropDownSelection = isTnlModal ? TransactionsOptions : OrderOptions;
  const dropDownOptions = Object.keys(dropDownSelection).map((option) => ({
    label: option,
    value: dropDownSelection[option],
  }));
  const [filters, setFilters] = useState(normalFilters);

  const [optionSelected, setOptionSelected] = useState();

  const onChangeOption = (value) => {
    const option = dropDownOptions.find((x) => x.value === value);
    setOptionSelected(option);
    setFilters((prev) => ({
      ...prev,
      ...(isTnlModal && { transaction_type: value }),
      ...(!isTnlModal && { search_type: value }),
    }));
  };

  const onChangeHandler = (e, key) => {
    let value = e.target.value;
    if (key == "search_value") {
      value = value;
    } else if (key !== "amount") {
      value = moment(value, "YYYY-MM-DD").format("DD-MM-YYYY");
    } else value = !isTnlModal ? value : Number(value);

    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className='filters-common m-3 p-2 bg-orange-300'>
      {modal == "transaction" && (
        <div className='flex mt-2'>
          <div className='flex-1'>Search By</div>
          <input
            type='text'
            placeholder='Search by free text'
            className='flex-1 border-b-2 border-gray-300 w-full w-64'
            value={filters?.q}
          />
        </div>
      )}
      <div className='flex items-center space-x-2 my-5'>
        <div className='flex-1'>
          {isTnlModal ? "Date Between" : "Delivery Date"}
        </div>
        <Input
          type='date'
          placeholder='Start-Date'
          name='start_date'
          className='flex-1'
          value={moment(filters?.start_date, "DD-MM-YYYY").format("YYYY-MM-DD")}
          onChange={(e) => onChangeHandler(e, "start_date")}
        />
        <Input
          type='date'
          placeholder='End-Date'
          name='end_date'
          className='flex-1'
          value={moment(filters?.end_date, "DD-MM-YYYY").format("YYYY-MM-DD")}
          onChange={(e) => onChangeHandler(e, "end_date")}
        />
      </div>
      <div className='flex items-center space-x-2'>
        <span className='flex-1'>Search By</span>
        <Select
          className='flex-1'
          options={dropDownOptions}
          onChange={onChangeOption}
          placeholder='Select one option'
          value={
            optionSelected || {
              label: filters?.transaction_type || filters?.search_type,
              value: filters?.transaction_type || filters?.search_type,
            }
          }
        />
        {isTnlModal && (
          <Input
            type='number'
            className='border-b-2 border-gray-300 flex-1'
            placeholder='Amount'
            value={filters?.amount}
            onChange={(e) => onChangeHandler(e, "amount")}
          />
        )}
        {!isTnlModal && (
          <input
            type='text'
            className='border-b-2 border-gray-300 flex-1 p-1'
            placeholder='Search'
            name='search_value'
            value={filters?.search_value}
            onChange={(e) => onChangeHandler(e, "search_value")}
          />
        )}
      </div>
      <div className='filters-footer flex justify-end space-x-2 mt-3'>
        <button
          className='orange-btn'
          onClick={() => {
            setFinalFilters(filters);
            // closeModal();
            setShouldFetch(true);
          }}
        >
          + Search
        </button>
        <button onClick={closeModal} className='w-32 bg-gray-200 rounded-lg'>
          close
        </button>
      </div>
    </div>
    // </Modal>
  );
}

export const AppliedFilters = ({ finalFilters, removeFilter }) => (
  <div className='bg-pink-300'>
    {Object.keys(finalFilters).map((filter) =>
      finalFilters[filter] ? (
        <div className='inline-flex border-gray-200 bg-gray-200 border-2 m-2 space-x-2 items-center'>
          <div className='text-sm'>{filter.toUpperCase()}:</div>
          <div>{finalFilters[filter]}</div>
          <button
            className='text-gray-400'
            onClick={() => removeFilter(filter)}
          >
            x
          </button>
        </div>
      ) : null
    )}
  </div>
);

export default CustomerFilters;
