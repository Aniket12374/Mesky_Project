import { httpVendor } from "../api-client";

export const sectorDataStats = (id = null) => {
  return httpVendor.get(
    "/api/delivery/portal/dashboard_rider_stats?rider_id=" + id
  );
};

export const dashboardStats = () => {
  return httpVendor.get("/api/delivery/portal/dashboard_stats");
};

export const dashboardTable = () => {
  return httpVendor.get("/api/delivery/portal/rider_order_stats");
};

export const presentOrders = () => {
  return httpVendor.get(
    `/api/delivery/portal/subscription/orders?_start=0&_end=${end}&is_tom_data=true`
  );
};
