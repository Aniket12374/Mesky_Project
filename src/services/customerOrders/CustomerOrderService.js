import { httpVendor } from "../api-client";

export const previousOrdersListing = (page = 1, size = 10) => {
  const start = (page - 1) * size;
  const end = start + size;
  return httpVendor.get(
    `api/delivery/portal/subscription/orders?_start=${start}&_end=${end}&is_tom_data=false`
  );
};

export const getTransactions = (_start = 0, _end = 10, payload = {}) => {
  return httpVendor.post(
    `api/support_dash/transactions?_start=${_start}&_end=${_end}`,
    payload
  );
};

export const getTransactionDetail = (transactionId) => {
  return httpVendor.get(
    `api/support_dash/view-transaction?transaction_id=${transactionId}`
  );
};
