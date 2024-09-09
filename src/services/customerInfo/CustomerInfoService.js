import { httpVendor } from "../api-client";

export const getCustomers = (searchTerm, _start = 0, _end = 20) => {
  return httpVendor.get(
    `api/support_dash/search?_start=${_start}&_end=${_end}&q=${searchTerm}`
  );
};

export const customerInfo = (
  payload = {
    is_address_info: true,
    is_customer_info: true,
    is_wallet_info: true,
  }
) => {
  return httpVendor.post(
    `api/support_dash/dashboard_info?_start=0&_end=3`,
    payload
  );
};

export const getSubscriptions = (activeType) => {
  return httpVendor.get(
    `api/subscription/list?subscription_type=${activeType}`
  );
};


export const updateSubscriptionDeatils = (payload) => {
  return httpVendor.put(`api/support_dash/update_subscription`, payload);
};

export const createSubscriptionDeatils = (payload) => {
  return httpVendor.post(`api/support_dash/create_subscription`, payload);
};

export const searchProductList = (search) => {
  return httpVendor.get(`api/support_dash/search-product?q=${search}`);

export const updateInfo = (payload) => {
  return httpVendor.put(`api/support_dash/edit-customer-info`, payload);
};

export const getPinDetails = async (pin) => {
  return httpVendor.get(`api/cart/pincode/info`, {
    params: {
      pincode: pin,
    },
  });

};
