import { httpVendor } from "../api-client";

export const presentOrders = () => {
  return httpVendor.get(
    "/api/delivery/portal/subscription/orders?_start=0&_end=200&is_tom_data=true"
  );
};

export const previousOrders = () => {
  return httpVendor.get(
    "api/delivery/portal/subscription/orders?_start=0&_end=200&is_tom_data=false"
  );
};
