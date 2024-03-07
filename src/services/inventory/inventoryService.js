import { httpVendor } from "../api-client";

export const debitInventory = (data) => {
  return httpVendor.post(`/api/product/inventory/debit-by-skuid`, {
    sku_id: data.skuId,
    quantity: data.quantity,
    debit_reason: data.reason,
    batch_number: data.batchNumber,
  });
};

export const creditInventory = (data) => {
  return httpVendor.post(`/api/product/inventory/credit-by-skuid`, {
    sku_id: data.skuId,
    quantity: data.quantity,
    batch_number: data.batchNumber,
  });
};

export const getAllInventory = () => {
  return httpVendor.get("/api/product/inventory/list-all");
};

export const getSkuIds = () => {
  return httpVendor.get("/api/vendor/product/skuid");
};
