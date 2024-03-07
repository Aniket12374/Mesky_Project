import { httpVendor } from "../api-client";

export const fetchAllOrders = (_start, _end) => {
  return httpVendor.get(`/api/vendor/order/list?_start=${_start}&_end=${_end}`);
};

export const generateShippingLabelService = (uid) => {
  return httpVendor
    .get(`/api/vendor/order/delhivery/shippinglabel?uid=${uid}`)
    .then((res) => {
      return res.data || [];
    })
    .catch((err) => {
      if (err.response?.data?.message) {
        console.log("error", err.response.data.message);
      } else {
        console.log("error", "Something went wrong. Please try again later.");
      }
    });
};

export const fetchDeliveredOrders = (_start, _end) => {
  return httpVendor.get(
    `/api/vendor/order/list/delivered?_start=${_start}&_end=${_end}`
  );
};

export const fetchOpenOrders = (_start, _end) => {
  return httpVendor.get(
    `/api/vendor/order/list/approved?_start=${_start}&_end=${_end}`
  );
};

export const fetchCancelledOrders = (_start, _end) => {
  return httpVendor.get(
    `/api/vendor/order/list/cancelled?_start=${_start}&_end=${_end}`
  );
};

export const fetchReturnedOrders = (_start, _end) => {
  return httpVendor.get(
    `/api/vendor/order/list/returned?_start=${_start}&_end=${_end}`
  );
};

export const fetchCompletedOrders = (_start, _end) => {
  return httpVendor.get(
    `/api/vendor/order/list/completed?_start=${_start}&_end=${_end}`
  );
};

export const createVendorOrderService = (storeId, uid) => {
  return httpVendor({
    method: "POST",
    url: "/api/vendor/order/delhivery/create",
    data: {
      store_id: storeId,
      uid,
    },
  })
    .then((res) => res.data)
    .catch((err) => {
      if (err.response?.data?.message) {
        showSnack("error", err.response.data.message);
      } else {
        showSnack("error", "Something went wrong. Please try again later.");
      }
    });
};

export const updateOrderStatus = (
  orderId,
  status,
  //   : 'REJECTED' | 'ACCEPTED',
  rejectReason
  //   ?: string
) => {
  return httpVendor({
    method: "POST",
    url: "/api/vendor/order/modify/accept_status",
    data: {
      orderitem_id: orderId,
      accept_status: status === "ACCEPTED" ? "True" : "False",
      ...(rejectReason ? { reject_reason: rejectReason } : {}),
    },
  })
    .then((res) => {
      showSnack("success", res?.data?.message);
      return res.data;
    })
    .catch((err) => {
      showSnack("error", err?.response?.data?.message);
      throw err;
    });
};

export const fetchOrderItemDetails = (orderId) => {
  return httpVendor({
    method: "GET",
    url: "/api/vendor/order/details",
    params: { orderitem_id: orderId },
  }).then((res) => res.data);
};

export const pickupRequestService = (
  orderIds,
  storeId,
  pickupDate,
  pickupTime
) => {
  return httpVendor({
    method: "POST",
    url: "/api/vendor/order/delhivery/pickup",
    data: {
      order_ids: orderIds,
      store_id: storeId,
      pickup_date: pickupDate,
      pickup_time: pickupTime,
    },
  })
    .then((res) => res.status)
    .catch((err) => {
      showSnack("error", err?.response?.data?.message);
      throw err;
    });
};

export const orderPickedup = (orderId) => {
  return httpVendor.post("/api/vendor/order/delhivery/haspickedup", {
    order_id: orderId,
  });
};

export const orderCancel = (data) => {
  return httpVendor.post("/api/vendor/order/cancel", {
    uid: data.uid,
    reason: data.reason,
  });
};

export const getOrderInvoice = (uid) => {
  return httpVendor.post(`/api/vendor/order/invoice?uid=${uid}`);
};

export const orderReturned = (orderId) => {
  return httpVendor.post("/api/vendor/order/returned", {
    order_id: orderId,
  });
};
