import { httpVendor } from "../api-client";

export const getWarehouse = () => {
  return httpVendor.get("/api/vendor/store/list");
};

export const editWarehouse = (data) => {
  return httpVendor.post("/api/vendor/store/edit", data);
};

export const createWarehouse = (data) => {
  return httpVendor.post("/api/vendor/store/create", data);
};
