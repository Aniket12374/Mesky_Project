import toast from "react-hot-toast";
import { httpVendor } from "../api-client";

export const presentOrders = (page = 1, size = 10) => {
  const start = (page - 1) * size;
  const end = start + size;
  return httpVendor.get(
    `/api/delivery/portal/subscription/orders?_start=${start}&_end=${end}&is_tom_data=true`
  );
};

export const previousOrders = (page = 1, size = 10) => {
  const start = (page - 1) * size;
  const end = start + size;
  return httpVendor.get(
    `api/delivery/portal/subscription/orders?_start=${start}&_end=${end}&is_tom_data=false`
  );
};

export const subscriptionPause = (data) => {
  return httpVendor.post("/api/delivery/portal/pause_item", data);
};

export const reAssignAgent = () => {
  return httpVendor
    .post("/api/delivery/portal/reassign_agent")
    .then((res) => {
      toast.success("Re-assigned Agent Successfully!");
    })
    .catch((err) => {
      toast.error("Not working properly!");
    });
};

export const SubscriptionSearch = (page = 1, size = 10, param) => {
  const start = (page - 1) * size;
  const end = start + size;
  return httpVendor.get(
    `/api/delivery/portal/subscription/orders?_start=${start}&_end=${end}&is_tom_data=true&q=${param}`
  );
};

export const HistorySearch = (page = 1, size = 10, param) => {
  const start = (page - 1) * size;
  const end = start + size;
  return httpVendor.get(
    `/api/delivery/portal/subscription/orders?_start=${start}&_end=${end}&is_tom_data=false&q=${param}`
  );
};

export const downloadCsv = () => {
  return httpVendor.post("/api/delivery/portal/export_tom_csv", {
    ops_email: "",
  });
};

export const subscriptionQtyChange = (data) => {
  return httpVendor.post("/api/delivery/portal/qty_update", data);
};

export const subscriptionSocietyChange = (data) => {
  return httpVendor.post("/api/delivery/portal/update_soc_sec", data);
};

export const csvUpload = (data) => {
  return httpVendor.post("/api/delivery/portal/bulk_upd_soc_sec", data);
};
