import { httpVendor } from "../api-client";

export const rankInfo = (data) => {
  return httpVendor.post("/api/delivery/portal/ranking", data);
};

export const routingStats = (id = null) => {
  return httpVendor.get("/api/delivery/portal/ranking?rider_id=" + id);
};
