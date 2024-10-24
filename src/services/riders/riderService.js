import { httpVendor } from "../api-client";

export const ridersList = (page = 1, size = 10) => {
  const start = (page - 1) * size;
  const end = start + size;
  return httpVendor.get(
    `/api/delivery/portal/riders/list?_start=${start}&_end=${end}`
  );
};

export const addRider = (data) => {
  return httpVendor.post("/api/delivery/portal/rider/add", data);
};

export const getSocieties = () => {
  return httpVendor.get("api/delivery/portal/society/list?_start=0&_end=1000");
};

export const getWarehouses = () => {
  return httpVendor.get("api/delivery/portal/warehouse_info");
};

export const modifyRider = (data) => {
  return httpVendor.post("/api/delivery/portal/rider", data);
};

export const feedBackRider = (data) => {
  return httpVendor.post("api/delivery/portal/rider_feedback", data);
};

export const getRiderFeedback = (id) => {
  return httpVendor.get(`api/delivery/portal/rider_feedback?rider_id=${id}`);
};

export const getRiderHistory = (id, page = 1, size = 10) => {
  const start = (page - 1) * size;
  const end = start + size;
  return httpVendor.get(
    `/api/delivery/portal/rider/history?rider_id=${id}&_start=${start}&_end=${
      end + 10
    }`
  );
};

export const getRiderData = (riderId) => {
  return httpVendor.get(`api/delivery/portal/rider?rider_id=${riderId}`);
};

export const getRiderInfo = () => {
  return httpVendor.get(`api/delivery/portal/rider_info`);
};
