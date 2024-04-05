import { httpVendor } from "../api-client";

export const presentOrders = (page = 1) => {
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return httpVendor.get(
    `/api/delivery/portal/subscription/orders?_start=${start}&_end=${end}&is_tom_data=true`
  );
};

export const previousOrders = () => {
  return httpVendor.get(
    "api/delivery/portal/subscription/orders?_start=0&_end=200&is_tom_data=false"
  );
};
