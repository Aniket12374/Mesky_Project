import Cookies from "js-cookie";

const customerToken = "customerToken";
const customerOrderVal = "currentOrderVal";

export const setCookie = (key, value) => {
  Cookies.set(key, value);
};

export const setCustomerTokenCookie = (value) => {
  Cookies.set(customerToken, value);
};

export const getCookie = (key) => {
  return Cookies.get(key);
};

export const setCookieOrderVal = (orderVal) => {
  return setCookie(customerOrderVal, orderVal);
};

export const getCookieWalletBalance = Number(getCookie("walletBalance"));

export const getCookieOrderVal = Number(getCookie("currentOrderVal"));

export const removeCookie = (key) => {
  Cookies.remove(key);
};

export const getTokenFromCookie = () => {
  return Cookies.get("token") || "";
};

export const getCustomerTokenFromCookie = () => {
  return Cookies.get(customerToken) || "";
};

export const removeTokenFromCookie = () => {
  removeCookie("token");
  removeCookie("customerAgent");
  removeCookie("userName");
  removeCookie("refundUser");
  removeCookie("walletBalance");
};

export const setTokenToCookie = (token) => {
  setCookie("token", token);
};

export const removeAllCookies = () => {
  let cookiesStored = ["token", "customerAgent", "userName", "refundUser"];
  cookiesStored.forEach((cookie) => {
    removeCookie(cookie);
  });
};
