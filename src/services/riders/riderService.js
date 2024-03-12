import { httpVendor } from "../api-client";

export const ridersList = () => {
  return httpVendor.get(
    `/api/delivery/portal/riders/list?_start=${0}&_end=${10}`
  );
};
