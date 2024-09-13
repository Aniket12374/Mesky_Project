import { httpCustomerAgent, httpVendor } from "../api-client";
import { getCustomerTokenFromCookie } from "../cookiesFunc";

export const getTransactions = (page = 1, size = 10, payload = {}) => {
  const start = (page - 1) * size;
  const end = start + size;
  return httpCustomerAgent.post(
    `api/support_dash/transactions?_start=${start}&_end=${end}`,
    { ...payload, i_csd: true }
  );
};

export const getTransactionDetail = (transactionId) => {
  return httpCustomerAgent.get(
    `api/support_dash/view-transaction?transaction_id=${transactionId}`
  );
};

export const getOrders = (page = 1, size = 5, filters = {}) => {
  const start = (page - 1) * size;
  let filtersAppend = "";
  Object.keys(filters).forEach((x) => {
    if (filters[x]) filtersAppend = filtersAppend + `&${x}=${filters[x]}`;
  });

  const end = start + size;
  return httpVendor.get(
    `api/order/subscription/delivery/history?_start=${start}&_end=${end}${filtersAppend}&is_csd=true&filter_by_status=DELIVERED`,
    {
      headers: {
        Authorization: getCustomerTokenFromCookie(),
      },
    }
  );
};
