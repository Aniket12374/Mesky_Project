import { httpVendor } from "../api-client";
import { setCookie, setTokenToCookie } from "../cookiesFunc";

export const loginUser = (userData) => {
  return httpVendor.post("/api/auth/email/signin", userData);
};

export const getMyDetails = () => {
  return httpVendor.get("/api/vendor/me");
};

export const otpRequest = (payload) => {
  return httpVendor.post("/api/auth/v3/otp_request", payload);
};

export const validateOtp = (payload) => {
  return httpVendor.post("/api/auth/v3/validate_otp", payload).then((res) => {
    setTokenToCookie(res.data.auth_token);
    setCookie("customerAgent", res?.data?.logged_user_info?.is_csd);
  });
};
