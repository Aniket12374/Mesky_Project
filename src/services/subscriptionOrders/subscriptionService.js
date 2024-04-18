import { httpVendor } from "../api-client";

export const presentOrders = (page = 1, size = 10) => {
  const start = (page - 1) * size;
  const end = start + size;
  return httpVendor.get(
    `/api/delivery/portal/subscription/orders?_start=${start}&_end=${end}&is_tom_data=true`
  );
};

export const previousOrders = (page = 1, size = 10) => {
  const start = (page - 1) * size;
  const end = start + size;
  return httpVendor.get(
    `api/delivery/portal/subscription/orders?_start=${start}&_end=${end}&is_tom_data=false`
  );
};

export const subscriptionPause = (data) => {
  return httpVendor.post("/api/delivery/portal/pause_item", data);
};
