import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import DataTable from "../Common/DataTable/DataTable";
import { useQuery } from "react-query";

import { Header } from "../../utils";
import Button from "../Common/Button";
import { Modal, Radio, Select, Tooltip } from "antd";
import moment from "moment/moment";
import {
  getAllInventory,
  creditInventory,
  debitInventory,
  getSkuIds,
} from "../../services/inventory/inventoryService";

const inputClassName =
  "p-2 rounded-lg focus:ring-white focus:outline-none credit-debit-boxshadow";

const TotalOptions = {
  credit: ["New Stock"],
  debit: ["Sold", "Sold at other places", "Discontinued"],
};

const InventoryTab = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const defaultValues = {
    skuId: "",
    quantity: "",
    batchNumber: "",
    type: "credit",
    reason: "",
  };
  const [creditDebitData, setCreditDebitData] = useState(defaultValues);
  const [options, setOptions] = useState(TotalOptions["credit"]);
  const [skuIdOptions, setSkuIdOptions] = useState([]);

  let colData = [];

  const {
    data,
    isLoading,
    isSuccess,
    refetch: refetchInventoryList,
  } = useQuery("InventoryList", getAllInventory);

  if (isSuccess) {
    colData = data.data.data;
  }

  useEffect(() => {
    getSkuIds()
      .then((res) => setSkuIdOptions(res.data))
      .catch((err) => {});
  }, [isModalOpen]);

  useEffect(() => {
    setCreditDebitData({ ...creditDebitData, reason: "" });
    setOptions(TotalOptions[creditDebitData["type"]]);
  }, [creditDebitData["type"]]);

  const ProductInventory = [
    {
      title: "DATE",
      dataIndex: "modified_date",
      key: "modified_date",
      render: (_, record) => {
        const date = record.modified_date.split(" ");
        return date && date[0];
      },
    },
    {
      title: "Name",
      dataIndex: "product_name",
      key: "product_name",
      width: 200,
      render: (product_name) => {
        return (
          <Tooltip placement="topLeft" title={product_name}>
            {product_name}
          </Tooltip>
        );
      },
    },
    {
      title: "SKU ID",
      dataIndex: "sku_id",
      key: "sku_id",
      ellipsis: true,
      render: (sku_id) => {
        return (
          <Tooltip placement="topLeft" title={sku_id}>
            {sku_id.length > 5 ? sku_id.slice(0, 5) + "..." : sku_id}
          </Tooltip>
        );
      },
    },
    {
      title: "OFFER PRICE",
      dataIndex: "offer_price",
      key: "offer_price",
      width: 100,
      render: (offer_price) => <div>₹ {offer_price}</div>,
    },
    {
      title: "VARIANT",
      dataIndex: "product_unit_quantity",
      key: "product_unit_quantity",
    },
    {
      title: "INVENTORY CHANGE",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: "ACTIVITY",
      dataIndex: "inventory_type",
      key: "inventory_type",
    },
    {
      title: "BATCH NUMBER",
      dataIndex: "batch_number",
      key: "batch_number",
    },
    {
      title: "REASONS",
      dataIndex: "debit_reason",
      key: "debit_reason",
      width: 120,
      render: (_, record) =>
        record.inventory_type === "CREDIT" ? "New Stock" : record.debit_reason,
    },
    {
      title: "QUANTITY",
      dataIndex: "current_quantity",
      key: "current_quantity",
      width: 90,
    },
  ];

  const handleApprove = () => {
    creditDebitData["type"] === "credit"
      ? creditInventory(creditDebitData)
          .then((res) => {
            setCreditDebitData(defaultValues);
            refetchInventoryList();
            toast.success(res?.data?.message, {
              position: "bottom-right",
            });
            setModalOpen(false);
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message, {
              position: "bottom-right",
            });
          })
      : debitInventory(creditDebitData)
          .then((res) => {
            setCreditDebitData(defaultValues);
            refetchInventoryList();
            toast.success(res?.data?.message, {
              position: "bottom-right",
            });
          })
          .catch((err) => {
            setCreditDebitData(creditDebitData);
            toast.error(err?.response?.data?.message, {
              position: "bottom-right",
            });
          });
  };
  const handleCancel = () => {
    setModalOpen(false);
    setCreditDebitData(defaultValues);
  };

  const enabled = Object.values(creditDebitData).every(
    (val) => val !== null && val !== ""
  );

  return (
    <React.Fragment>
      <div className="flex justify-between">
        <Header text="Inventory" />
        <Button btnName={"Credit/Debit"} onClick={() => setModalOpen(true)} />
      </div>
      <Modal
        title="Credit/Debit"
        centered
        open={isModalOpen}
        onCancel={handleCancel}
        footer={
          <div>
            <Button
              btnName={"Apply"}
              className="p-2"
              onClick={handleApprove}
              disabled={!enabled}
              cancelBtn={!enabled}
            />
            <Button
              btnName={"Cancel"}
              cancelBtn
              className="p-2"
              onClick={handleCancel}
            />
          </div>
        }
      >
        <div className="flex flex-col">
          <label className="mt-5">SKU ID</label>
          <Select
            showSearch
            allowClear={true}
            size="large"
            value={creditDebitData.skuId}
            placeholder="Sku Id"
            optionFilterProp="children"
            onChange={(value) =>
              setCreditDebitData({
                ...creditDebitData,
                skuId: value,
              })
            }
            style={{ width: "100%" }}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            className={`${inputClassName} credit-debit-tab`}
            options={skuIdOptions?.map((opt) => ({
              value: opt.sku_id,
              label: opt.sku_id,
            }))}
          />
          <label className="mt-5">PRODUCT QUANTITY</label>
          <input
            name="quantity"
            onChange={(e) =>
              setCreditDebitData({
                ...creditDebitData,
                quantity: e.target.value,
              })
            }
            value={creditDebitData["quantity"]}
            className={`${inputClassName} p-3`}
          />
          <label className="mt-5">BATCH NUMBER</label>
          <input
            name="batchNumber"
            onChange={(e) =>
              setCreditDebitData({
                ...creditDebitData,
                batchNumber: e.target.value,
              })
            }
            value={creditDebitData["batchNumber"]}
            className={`${inputClassName} p-3`}
          />
          <label className="mt-5">REASON</label>
          <Select
            options={
              options &&
              options.map((x) => ({
                label: x,
                value: x,
              }))
            }
            className={`${inputClassName} credit-debit-tab`}
            onChange={(value) =>
              setCreditDebitData({
                ...creditDebitData,
                reason: value,
              })
            }
            value={creditDebitData["reason"]}
          />
          <div className="text-center mt-10">
            <Radio.Group
              value={creditDebitData.type}
              onChange={(e) =>
                setCreditDebitData({
                  ...creditDebitData,
                  reason: "",
                  type: e.target.value,
                })
              }
            >
              <Radio value="credit">Credit</Radio>
              <Radio value={"debit"}>Debit</Radio>
            </Radio.Group>
          </div>
        </div>
      </Modal>

      <DataTable
        data={colData}
        columns={ProductInventory}
        scroll={{ y: 430 }}
        loading={isLoading}
        pagination
        rowClassName="h-24"
      />
    </React.Fragment>
  );
};

export default InventoryTab;
