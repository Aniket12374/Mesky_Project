import { httpVendor } from "../api-client";

// export const assignAgent = (data) => {
//   return httpVendor.post("/api/delivery/portal/area_mapping", data);
// };

export const dashboardStats = () => {
  return httpVendor.get("/api/delivery/portal/dashboard_stats");
};
