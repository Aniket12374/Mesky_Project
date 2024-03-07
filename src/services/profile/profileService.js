import { httpVendor } from "../api-client";

export const brandEdit = (data) => {
  return httpVendor.post("/api/vendor/brand/edit", data);
};

export const brandList = () => {
  return httpVendor.get("/api/vendor/brand/list");
};

export const getBrand = (id) => {
  return httpVendor
    .get(`/api/vendor/brand/details?brand_id=${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    })
    .finally(() => {});
};

export const addHoliday = (data) => {
  return httpVendor.post("/api/vendor/store/holiday/create", data);
};

export const holidayList = () => {
  return httpVendor.get("api/vendor/store/holiday/list");
};

export const updateHoliday = (data) => {
  return httpVendor.post("api/vendor/store/holiday/edit", data);
};

export const deleteHoliday = (id) => {
  return httpVendor.post("api/vendor/store/holiday/delete", {
    id: id,
  });
};
