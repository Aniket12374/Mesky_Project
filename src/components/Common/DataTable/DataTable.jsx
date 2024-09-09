import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Table } from "antd";
import PropTypes from "prop-types";
import { CSVLink } from "react-csv";

export const DataTable = ({
  data,
  navigateTo,
  columns,
  pagination = false,
  onClick = null,
  checkbox = false,
  radio = false,
  getSelectedRows = null,
  tableSize = "middle",
  loading = false,
  scroll,
  fileName = "Listing.csv",
  onChange = {},
  setSearch,
  search,
  handleSearch,
  setSearchData,
  setShowSearchData,
  ...OtherProps
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const paths = ["/subscription", "/history", "/customer/credit"];
  const pathIncludes = paths.some((path) => location?.pathname.includes(path));
  const iscustomerPage = location?.pathname.includes("/customer");

  const selectionType = checkbox ? "checkbox" : radio ? "radio" : null;
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      getSelectedRows(selectedRows);
    },
  };

  data &&
    data.forEach((rowData, index) => {
      rowData["key"] = index;
    });

  return (
    <>
      {!iscustomerPage && (
        <CSVLink
          filename={fileName}
          data={data}
          className="bg-[#ff0000] text-white rounded-lg px-2 py-[10px] relative top-2"
        >
          Export to CSV
        </CSVLink>
      )}
      {pathIncludes && (
        <>
          <input
            type="text"
            placeholder="Enter your search..."
            className="w-56 h-10 p-2 border border-[#65CBF3] border-2 relative left-4 top-2 rounded-md"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />

          <button
            className="left-5 px-2 top-2 relative bg-[#DF4584] rounded-md text-white p-2"
            onClick={handleSearch}
            disabled={!search}
          >
            Submit
          </button>
          {search && (
            <button
              className="bg-gray-300 text-black w-8 relative right-[88px] rounded-lg top-2"
              onClick={() => {
                setSearch("");
                setSearchData("");
                setShowSearchData(false);
              }}
            >
              X
            </button>
          )}
        </>
      )}
      <div className="antd-table mt-5 mr-5">
        <Table
          className=""
          onRow={(i) => ({
            onClick: (e) => {
              if (
                e.target.localName === "button" ||
                e.target.localName === "img" ||
                e.target.classList.value === "ant-switch-inner" ||
                e.target.classList.value === "ant-switch-handle" ||
                e.target.classList.value.includes("non-redirectable")
              ) {
                e.preventDefault();
              } else {
                navigateTo && navigate(`${navigateTo}${i.id}`);
              }
            },
          })}
          columns={columns}
          dataSource={data}
          size={tableSize}
          pagination={pagination}
          rowSelection={
            selectionType && {
              ...rowSelection,
              type: selectionType,
            }
          }
          loading={loading}
          scroll={scroll ? scroll : ""}
          onChange={onChange}
          {...OtherProps}
        />
      </div>
    </>
  );
};

DataTable.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  navigateTo: PropTypes.string,
  pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  checkbox: PropTypes.bool,
  onClick: PropTypes.func,
  tableSize: PropTypes.string,
  scroll: PropTypes.object,
};

export default DataTable;
