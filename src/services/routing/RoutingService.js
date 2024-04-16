import { httpVendor } from "../api-client";

export const riderInfo = (data) => {
  return httpVendor.post("/api/delivery/portal/ranking", data);
};

export const routingStats = () => {
  return httpVendor.get("/api/delivery/portal/ranking?rider_id=2");
};
