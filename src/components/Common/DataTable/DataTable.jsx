import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  ...OtherProps
}) => {
  const navigate = useNavigate();
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
      <CSVLink
        filename={fileName}
        data={data}
        className="bg-[#ff0000] text-white rounded-lg px-2 py-[10px] relative top-2"
      >
        Export to CSV
      </CSVLink>
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
