import axios from "axios";
import { getCustomerTokenFromCookie, getTokenFromCookie } from "./cookiesFunc";

const VITE_VENDOR_API_PROD_URL = "https://mesky.in/main";
const VITE_VENDOR_API_STAGE_URL = "https://stage.mesky.in/main";

const BASE_URL = import.meta.env.VITE_ENV.includes("prod")
  ? VITE_VENDOR_API_PROD_URL
  : VITE_VENDOR_API_STAGE_URL;

export const httpVendor = axios.create({
  baseURL: BASE_URL,
});

httpVendor.interceptors.request.use((conf) => {
  const token = getTokenFromCookie();

  if (token) {
    conf.headers = {
      Authorization: token,
      ...conf.headers,
    };
  }
  return conf;
});

export const httpCustomerAgent = axios.create({
  baseURL: BASE_URL,
});

httpCustomerAgent.interceptors.request.use((conf) => {
  const token = getTokenFromCookie();
  const customerToken = getCustomerTokenFromCookie();

  if (token) {
    conf.headers = {
      ...conf.headers,
      Authorization: token,
      Customertoken: customerToken,
    };
  }
  return conf;
});

export const httpCreators = axios.create({
  baseURL: `${import.meta.env.VITE_API_CREATOR_URL}`,
});

export const httpVendorUpload = axios.create({
  baseURL: `${import.meta.env.VITE_VENDOR_UPLOAD_API_URL}`,
});

httpVendorUpload.interceptors.request.use((conf) => {
  conf.headers = {
    ...conf.headers,
    Authorization: "TkGZRT5lAPhx3YHrdd7R",
  };

  return conf;
});
