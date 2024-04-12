import { httpVendor } from "../api-client";

// export const assignAgent = (data) => {
//   return httpVendor.post("/api/delivery/portal/area_mapping", data);
// };

export const routingStats = () => {
  return httpVendor.get("/api/delivery/portal/ranking?rider_id=2");
};
