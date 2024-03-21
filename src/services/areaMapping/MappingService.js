import { httpVendor } from "../api-client";

export const assignAgent = (data) => {
  return httpVendor.post("/api/delivery/portal/area_mapping", data);
};

export const mappingList = () => {
  return httpVendor.get("api/delivery/portal/area_mapping?_start=0&_end=200");
};
