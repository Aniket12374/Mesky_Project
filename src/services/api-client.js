import axios from "axios";
import { getTokenFromCookie } from "./cookiesFunc";

export const httpVendor = axios.create({
  baseURL: `${import.meta.env.VITE_VENDOR_API_URL}`,
});

httpVendor.interceptors.request.use((conf) => {
  const token = getTokenFromCookie();
  if (token) {
    conf.headers = {
      ...conf.headers,
      Authorization: "ISPRgFVqVCn9grwzVU20",
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
