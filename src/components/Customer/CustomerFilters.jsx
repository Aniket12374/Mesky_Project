import React, { useEffect, useState } from "react";
import { Input, Modal, Select, DatePicker } from "antd";
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
  "Product Name": "product_name",
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
  removeFilter,
  setAppliedFilters,
  appliedFilters,
  clear,
}) {
  const normalFilters =
    Object.keys(finalFilters).length > 0 ? finalFilters : {};
  const isTnlModal = modal == "transaction";
  const dropDownSelection = isTnlModal ? TransactionsOptions : OrderOptions;
  const dropDownOptions = Object.keys(dropDownSelection).map((option) => ({
    label: option,
    value: dropDownSelection[option],
  }));
  const [filters, setFilters] = useState(normalFilters);

  useEffect(() => {
    setFilters(finalFilters);
  }, [finalFilters]);

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
    let value = "";

    if (key == "search_value") {
      value = e.target.value;
    } else if (key !== "amount") {
      value = e;
    } else value = !isTnlModal ? e.target.value : Number(e.target.value);

    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className='filters-common drop-shadow-md border-1 rounded-md border-gray-200 m-2 p-2 text-xs'>
      {/* {modal == "transaction" && (
        <div className='flex space-x-2 mt-2'>
          <div className='w-1/6'>Search By</div>
          <input
            type='text'
            placeholder='Search by free text'
            className='flex-1 p-1 border-b-2 border-gray-300 rounded-md'
            value={filters?.q}
          />
        </div>
      )} */}
      <div className='flex items-center space-x-2 my-5'>
        <div className='w-1/6'>
          {isTnlModal ? "Date Between" : "Delivery Date"}
        </div>
        <DatePicker
          name='start_date'
          placeholder='Start Date'
          format={"DD-MM-YYYY"}
          value={
            filters?.start_date
              ? moment(filters?.start_date, "DD-MM-YYYY")
              : null
          }
          onChange={(val) => {
            let formattedDate = val.format("DD-MM-YYYY");
            onChangeHandler(formattedDate, "start_date");
          }}
        />
        <DatePicker
          name='end_date'
          format={"DD-MM-YYYY"}
          placeholder='End Date'
          value={
            filters?.end_date ? moment(filters?.end_date, "DD-MM-YYYY") : null
          }
          onChange={(val) => {
            let formattedDate = val.format("DD-MM-YYYY");
            onChangeHandler(formattedDate, "end_date");
          }}
        />
      </div>
      <div className='flex items-center space-x-2'>
        <span className='w-1/6'>Search By</span>
        <Select
          size={"large"}
          className='flex-1 w-8/12'
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
            className='border-b-2 border-gray-300 flex-1 w-2/12 p-2'
            placeholder='Amount'
            value={filters?.amount}
            onChange={(e) => onChangeHandler(e, "amount")}
          />
        )}
        {!isTnlModal && (
          <Input
            type='text'
            className='border-b-2 border-gray-300 flex-1 p-2 w-5/12 rounded-lg'
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
            setShouldFetch(true);
            setAppliedFilters(filters);
          }}
        >
          + Search
        </button>
        <button onClick={closeModal} className='w-32 bg-gray-200 rounded-lg'>
          close
        </button>
      </div>

      <AppliedFilters
        finalFilters={appliedFilters}
        removeFilter={removeFilter}
        clear={clear}
      />
    </div>
  );
}

export const AppliedFilters = ({ finalFilters, removeFilter, clear }) => (
  <div className='mt-5'>
    {Object.keys(finalFilters).map((filter) =>
      finalFilters[filter] !== null ? (
        <div className='inline-flex bg-[#F3EBFE] m-1 p-1 rounded-md space-x-2 items-center font-bold'>
          <div className=''>{filter.toUpperCase()}:</div>
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
    <div>
      {Object.keys(finalFilters).length > 0 && (
        <button
          onClick={clear}
          className='bg-[#fc8172] p-1 rounded-lg font-bold text-white'
        >
          Clear All
        </button>
      )}
    </div>
  </div>
);

export default CustomerFilters;
