import toast from "react-hot-toast";
import { httpVendor } from "../api-client";

export const customerSearchService = (searchValue, page = 1, size = 10) => {
  const start = (page - 1) * size;
  const end = start + size;
  return httpVendor.get(
    `api/delivery/portal/customer_search?q=${searchValue}&_start=${start}&_end=${end}`
  );
};

export const customerWalletTopUp = (data) => {
  return httpVendor.post(`api/delivery/portal/wallet_top_up`, data);
};
