import { httpVendor } from "../api-client";

export const loginUser = (userData) => {
  return httpVendor.post("/api/auth/email/signin", userData);
};

export const getMyDetails = () => {
  return httpVendor.get("/api/vendor/me");
};
