import Cookies from "js-cookie";

export const setCookie = (key, value) => {
  Cookies.set(key, value);
};

export const getCookie = (key) => {
  return Cookies.get(key);
};

export const removeCookie = (key) => {
  Cookies.remove(key);
};

export const getTokenFromCookie = () => {
  return Cookies.get("token") || "";
};

export const removeTokenFromCookie = () => {
  removeCookie("token");
};

export const setTokenToCookie = (token) => {
  setCookie("token", token);
};
