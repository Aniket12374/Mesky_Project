import { httpVendor } from "../api-client";

export const ridersList = () => {
  return httpVendor.get(
    `/api/delivery/portal/riders/list?_start=${0}&_end=${20}`
  );
};

export const addRider = (data) => {
  return httpVendor.post("/api/delivery/portal/rider/add", data);
};

export const getSocieties = () => {
  return httpVendor.get("api/delivery/portal/society/list?_start=0&_end=30");
};

export const modifyRider = (data) => {
  return httpVendor.post("/api/delivery/portal/rider", data);
};

export const getRiderHistory = (id) => {
  return httpVendor.get(`/api/delivery/portal/rider/history?rider_id=${id}`);
};
