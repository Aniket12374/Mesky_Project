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
    .get("/api/delivery/portal/reassign_agent")
    .then((res) => {
      toast.error("Re-assigned Agent Successfully!");
    })
    .catch((err) => {
      toast.error("Not working properly!");
    });
};

export const subscriptionQtyChange = (data) => {
  return httpVendor.post("/api/delivery/portal/qty_update", data);
};

export const subscriptionSocietyChange = (data) => {
  return httpVendor.post("/api/delivery/portal/update_soc_sec", data);
};
