import { httpVendor } from "../api-client";

export const assignAgent = (data) => {
  return httpVendor.post("/api/delivery/portal/area_mapping_v2", data);
};

export const mappingList = (start = 0) => {
  return httpVendor.get(
    `/api/delivery/portal/area_mapping_v2?_start=${start}&_end=${start + 20}`
  );
};
