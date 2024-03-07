import { httpVendor } from "../api-client";

export const getBrandsOfUser = () => {
  return httpVendor.get("/api/vendor/brand/list");
};

export const getCategories = () => {
  return httpVendor.get("/api/categories");
};

export const getHashTags = () => {
  return httpVendor.get("/api/vendor/post/hashtag/list");
};

export const getProducts = () => {
  return httpVendor.get("/api/vendor/product/list");
};

export const createPost = (obj) => {
  return httpVendor.post("/api/vendor/post/create", obj);
};

export const getVendorPosts = (_start) => {
  return httpVendor.get(
    `/api/vendor/post/list?_start=${_start}&_end=${_start + 20}`
  );
};

export const getProductNames = (brandId) => {
  return httpVendor.get(`/api/vendor/product/v2/list?brand_id=${brandId}`);
};

export const getPostDetails = ({ queryKey }) => {
  const [_, postId] = queryKey;
  return httpVendor.get(`/api/vendor/post/details?post_id=${postId}`);
};

export const editPost = (postObj) => {
  return httpVendor.post("/api/vendor/post/edit", postObj);
};

export const changePostStatus = (postData) => {
  return httpVendor.post("/api/vendor/post/status/change", {
    post_id: postData.postId,
    enable: postData.enable,
  });
};
