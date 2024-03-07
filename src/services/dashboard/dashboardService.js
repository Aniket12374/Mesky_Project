import { httpVendor } from "../api-client";

export const ecommerceAnalysis = () => {
  return httpVendor.get("/api/vendor/dashboard/ecom");
};

export const topProducts = () => {
  return httpVendor.get("/api/vendor/dashboard/ecom/top-products");
};

export const topProductsgMV = () => {
  return httpVendor.get("api/vendor/dashboard/ecom/top-products-gmv");
};

export const socialAnalysis = () => {
  return httpVendor.get("api/vendor/dashboard/social");
};

export const socialTopPosts = () => {
  return httpVendor.get("api/vendor/dashboard/social/top-posts");
};
