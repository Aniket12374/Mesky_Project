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
  const isTnlM = modal == "transaction";
  const dropDownSelection = isTnlM ? TransactionsOptions : OrderOptions;
  const dropDownOptions = Object.keys(dropDownSelection).map((option) => ({
    label: option,
    value: dropDownSelection[option],
  }));
  const [filters, setFilters] = useState(finalFilters || {});
  const [optionSelected, setOptionSelected] = useState();

  useEffect(() => {
    setFilters(finalFilters);
  }, [finalFilters]);

  const onChangeOption = (value) => {
    const option = dropDownOptions.find((x) => x.value === value);
    setOptionSelected(option);
    setFilters((prev) => ({
      ...prev,
      ...(isTnlM && { transaction_type: value }),
      ...(!isTnlM && { search_type: value }),
    }));
  };

  const onChangeHandler = (e, key) => {
    let value = "";
    if (key == "search_value") {
      value = e.target.value;
    } else if (key !== "amount") {
      value = e;
    } else value = !isTnlM ? e.target.value : Number(e.target.value);

    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const showBoxShadow =
    Object.keys(appliedFilters).length > 0 ||
    Object.keys(finalFilters).length > 0 ||
    open;

  const handleSearch = () => {
    setFinalFilters(filters);
    setShouldFetch(true);
    setAppliedFilters(filters);
  };

  const dateFormat = "DD-MM-YYYY";

  return (
    <div className={`${showBoxShadow ? "filters-boxshadow-common" : ""}`}>
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
      {open && (
        <div className='filters'>
          <div className='filters-dates flex items-center space-x-2 my-5'>
            <div className='w-1/6'>
              {isTnlM ? "Date Between" : "Delivery Date"}
            </div>
            {["start_date", "end_date"].map((date, index) => (
              <DatePicker
                name={date}
                placeholder={date.replace("_", " ")}
                format={dateFormat}
                value={filters[date] ? moment(filters[date], dateFormat) : null}
                onChange={(val) => {
                  let formattedDate = val.format(dateFormat);
                  onChangeHandler(formattedDate, date);
                }}
              />
            ))}
          </div>
          <div className='filters-search flex items-center space-x-2'>
            <span className='w-1/6'>Search By</span>
            <Select
              size={"large"}
              className='flex-1 w-8/12'
              options={dropDownOptions}
              onChange={onChangeOption}
              placeholder='Select one option'
              defaultValue={{
                label: filters?.transaction_type || filters?.search_type || "",
                value: filters?.transaction_type || filters?.search_type | "",
              }}
            />
            <Input
              type={isTnlM ? "number" : "text"}
              className='border-b-2 border-gray-300 flex-1 w-2/12 p-2'
              placeholder={isTnlM ? "Amount" : "Search"}
              value={isTnlM ? filters?.amount : filters?.search_value}
              onChange={(e) =>
                onChangeHandler(e, isTnlM ? "amount" : "search_value")
              }
            />
          </div>
          <div className='filters-footer flex justify-end space-x-2 mt-3'>
            <button className='orange-btn' onClick={handleSearch}>
              + Search
            </button>
            <button
              onClick={closeModal}
              className='w-32 bg-gray-200 rounded-lg'
            >
              Close
            </button>
          </div>
        </div>
      )}
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
