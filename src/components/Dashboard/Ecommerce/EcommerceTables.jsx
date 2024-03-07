import React from "react";
import { useQuery } from "react-query";
import { Tooltip } from "antd";
import DataTable from "../../Common/DataTable/DataTable";
import {
  topProducts,
  topProductsgMV,
} from "../../../services/dashboard/dashboardService";

const ProductsByUnitSoldColumns = [
  {
    title: "NAME",
    dataIndex: "name",
    key: "name",
    ellipsis: true,
    render: (name) => {
      return (
        <Tooltip placement="topLeft" title={name}>
          {name}
        </Tooltip>
      );
    },
  },
  {
    title: "VARIANT",
    dataIndex: "variant",
    key: "variant",
    align: "center",
    width: 100,
  },
  {
    title: "# OF UNITS",
    dataIndex: "unit_sold",
    key: "unit_sold",
    align: "center",
    width: 100,
  },
];

const ProductsByGMVColumns = [
  {
    title: "NAME",
    dataIndex: "name",
    key: "name",
    ellipsis: true,
    width: 400,
    render: (name) => {
      return (
        <Tooltip placement="topLeft" title={name}>
          {name}
        </Tooltip>
      );
    },
  },
  {
    title: "VARIANT",
    dataIndex: "variant",
    key: "variant",
    align: "center",
    width: 100,
  },
  {
    title: "GMV",
    dataIndex: "gmv",
    key: "gmv",
    align: "center",
    width: 100,
  },
];

export const EcommerceTables = () => {
  return (
    <div className="ecommerce-tab-tables">
      <div className="flex">
        <ProductsByUnitSold />
        <ProductsByGMV />
      </div>
    </div>
  );
};

export const ProductsByUnitSold = () => {
  const { data, isLoading, isSuccess } = useQuery(
    "ProductsByUnitSold",
    topProducts
  );
  const products = isSuccess ? data?.data : [];
  let colData = [];
  colData = isSuccess
    ? products.map((item) => ({
        name: item.product.product_sn,
        unit_sold: item.unit_sold,
        variant: item.product.product_size,
      }))
    : [];

  return (
    <div className="mt-3 mr-5">
      <div className="text-2xl text-[#A8A8A8] font-medium">
        Top 5 Products by Units Sold
      </div>
      <DataTable
        data={isSuccess ? colData : []}
        columns={ProductsByUnitSoldColumns}
        loading={isLoading}
        size="small"
      />
    </div>
  );
};

export const ProductsByGMV = () => {
  const { data, isLoading, isSuccess } = useQuery(
    "ProductsByGmv",
    topProductsgMV
  );
  const products = isSuccess ? data?.data : [];
  let colData = [];
  colData = isSuccess
    ? products.map((item) => ({
        name: item.product.product_sn,
        gmv: item.gmv,
        variant: item.product.product_size,
      }))
    : [];

  return (
    <div>
      <div className="mt-3 text-2xl text-[#A8A8A8] font-medium">
        Top 5 Products by GMV
      </div>
      <DataTable
        data={colData}
        columns={ProductsByGMVColumns}
        loading={isLoading}
        size="small"
      />
    </div>
  );
};

export default EcommerceTables;
