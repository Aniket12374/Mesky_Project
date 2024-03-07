import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Switch, Tooltip, Popover } from "antd";
import DataTable from "../Common/DataTable/DataTable";

import {
  getVendorProducts,
  productStatusUpdate,
  updateProductStockOut,
  updateProductAllowReturnable,
} from "../../services/product/productService";
import toast from "react-hot-toast";

const ListingPage = () => {
  const [selectedRows, getSelectedRows] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    let products = await getVendorProducts(0);
    let res = [...products.data.data];
    return res;
  };

  const { data, isLoading, refetch, isFetching } = useQuery(
    "vendorProducts",
    fetchProducts,
    {
      staleTime: 120000,
      cacheTime: 120000,
    }
  );

  const queryClient = useQueryClient();

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const handleStatusUpdate = (e, item) => {
    setLoading(true);
    let item1 = data.find((dataItem) => dataItem.key === item.key);
    item1.is_active = !item1.is_active;

    const statusData = { enable: item1.is_active ? 1 : 0, id: item1.id };

    productStatusUpdate(statusData)
      .then((res) => {
        refetch();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Please try again later");
        setLoading(false);
      });
  };

  // const handleAcceptReturnableUpdate = (e, item) => {
  //   let item1 = data.find((dataItem) => dataItem.key === item.key);
  //   item1.allow_return = !item1.allow_return;

  //   const status = {
  //     id: item1.id,
  //     status: item1.allow_return,
  //   };

  //   updateProductAllowReturnable(status)
  //     .then((res) => {
  //       queryClient.invalidateQueries(["vendorProducts"]);
  //     })
  //     .catch((err) => {});
  // };

  const handleOutOfStockUpdate = (e, item) => {
    setLoading(true);
    let item1 = data.find((dataItem) => dataItem.key === item.key);

    const stockOut = {
      id: item1.id,
      stock_out: item1.quantity === 0 ? false : true,
    };

    updateProductStockOut(stockOut)
      .then((res) => {
        refetch();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error("Error!! Please try again after sometime");
      });
  };

  const ProductHeaders = [
    {
      title: "MEDIA",
      dataIndex: "images_list",
      key: "images_list",
      align: "center",
      width: 150,
      render: (_, record) => {
        const mediaImages =
          record.images_list.length > 0
            ? record.images_list
            : [record.default_image];
        let images = mediaImages.slice(0, 3);
        const imagesCount = record.images_list.length;
        const imageList = () => {
          const recordImages =
            record.images_list.length > 0
              ? record.images_list
              : [record.default_image];
          return (
            <div className="flex flex-wrap space-x-2">
              {recordImages.slice(3).map((imgRecord, index) => (
                <span key={index}>
                  <img
                    src={imgRecord}
                    alt={`image_${index}`}
                    className="object-fill mt-2 rounded-lg h-12 w-12"
                  />
                </span>
              ))}
            </div>
          );
        };
        return (
          <div className="flex space-x-2 flex-wrap">
            {images.map((imgRecord, index) => (
              <span key={index}>
                <img
                  src={imgRecord}
                  alt={`image_${index}`}
                  className="object-fill mt-2 rounded-lg h-12 w-12"
                />
              </span>
            ))}
            {imagesCount > 3 && (
              <Popover content={imageList}>
                <small>...Show more</small>
              </Popover>
            )}
          </div>
        );
      },
    },
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
      width: 150,
      filterSearch: true,
      filterMode: "tree",
      filters:
        data &&
        data.map((x) => ({
          text: x.name,
          value: x.name,
        })),
      onFilter: (value, record) => record.name.includes(value),

      render: (name) => (
        <Tooltip placement="topLeft" title={name}>
          {name.length > 45 ? name.slice(0, 40) + "..." : name}
        </Tooltip>
      ),
    },
    {
      title: "SKU ID",
      dataIndex: "sku_id",
      key: "sku_id",
      align: "center",
      width: 100,
      filterMode: "tree",
      filterSearch: true,
      filters:
        data &&
        data.map((x) => ({
          text: x.sku_id,
          value: x.sku_id,
        })),
      onFilter: (value, record) => record.sku_id.includes(value),
      render: (sku_id) => (
        <Tooltip placement="topLeft" title={sku_id}>
          {sku_id}
        </Tooltip>
      ),
    },
    {
      title: "SELLING PRICE",
      dataIndex: "selling_price",
      key: "selling_price",
      align: "center",
      width: 80,
      sorter: {
        compare: (a, b) => a.selling_price - b.selling_price,
        multiple: 1,
      },
      sortOrder:
        sortedInfo.columnKey === "selling_price" ? sortedInfo.order : null,
    },
    // {
    //   title: "DISCOUNT",
    //   dataIndex: "discount",
    //   key: "discount",
    //   align: "center",
    //   width: 80,
    //   sorter: {
    //     compare: (a, b) => a.discount - b.discount,
    //     multiple: 1,
    //   },
    //   sortOrder: sortedInfo.columnKey === "discount" ? sortedInfo.order : null,
    // },
    {
      title: "OFFER PRICE",
      dataIndex: "offer_price",
      key: "offer_price",
      align: "center",
      width: 80,
      sorter: {
        compare: (a, b) => a.offer_price - b.offer_price,
        multiple: 1,
      },
      sortOrder:
        sortedInfo.columnKey === "offer_price" ? sortedInfo.order : null,
    },
    {
      title: "INVENTORY QUANTITY",
      dataIndex: "quantity",
      key: "quantity",
      width: 80,
      align: "center",
      sorter: {
        compare: (a, b) => a.quantity - b.quantity,
        multiple: 1,
      },
      sortOrder: sortedInfo.columnKey === "quantity" ? sortedInfo.order : null,
    },
    {
      title: "PRODUCT SIZE",
      dataIndex: "unit_quantity",
      key: "unit_quantity",
      align: "center",
      width: 80,
    },
    {
      title: "LIVE STATUS",
      dataIndex: "is_active",
      key: "is_active",
      align: "center",
      width: 80,
      filters: [
        {
          text: "ACTIVE",
          value: true,
        },
        {
          text: "INACTIVE",
          value: false,
        },
      ],
      filterMode: "tree",
      onFilter: (value, record) => record.is_active == value,
      render: (_, record) => (
        <Switch
          style={{
            backgroundColor: record["is_active"] ? "#65CBF3" : "#E2E2EA",
          }}
          checked={record.is_active}
          onChange={(event) => handleStatusUpdate(event, record)}
        />
      ),
    },
    // {
    //   title: "ACCEPT RETURNABLE?",
    //   dataIndex: "allow_return",
    //   key: "allow_return",
    //   width: 100,
    //   align: "center",
    //   filters: [
    //     {
    //       text: "RETURNABLE",
    //       value: true,
    //     },
    //     {
    //       text: "NOT RETURNABLE",
    //       value: false,
    //     },
    //   ],
    //   filterMode: "tree",
    //   onFilter: (value, record) => record.allow_return == value,
    //   render: (_, record) => (
    //     <Switch
    //       style={{
    //         backgroundColor: record["allow_return"] ? "#65CBF3" : "#E2E2EA",
    //       }}
    //       className="ant-table-cell-row-hover"
    //       checked={record.allow_return}
    //       onChange={(event) => handleAcceptReturnableUpdate(event, record)}
    //     />
    //   ),
    // },
    {
      title: "OUT OF STOCK",
      dataIndex: "stock_out",
      key: "stock_out",
      align: "center",
      width: 80,
      filters: [
        {
          text: "STOCK",
          value: 1,
        },
        {
          text: "STOCK OUT",
          value: 0,
        },
      ],
      filterMode: "tree",
      onFilter: (value, record) => record["quantity"] >= value,
      render: (_, record) => (
        <Switch
          style={{
            backgroundColor: record["quantity"] === 0 ? "#ff0000" : "#E2E2EA",
          }}
          checked={record["quantity"] === 0}
          onChange={(event) => {
            handleOutOfStockUpdate(event, record);
          }}
        />
      ),
    },
  ];

  const sortedData = data && data.sort((a, b) => a.id - b.id);

  return (
    <div className="product-listing-page">
      <DataTable
        data={sortedData}
        navigateTo="/products/edit/"
        columns={ProductHeaders}
        pagination={true}
        getSelectedRows={getSelectedRows}
        scroll={{ y: 430 }}
        loading={isLoading || loading || isFetching}
        rowClassName="h-24"
        onChange={handleChange}
      />
    </div>
  );
};

export default ListingPage;
