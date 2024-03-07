import { httpVendor } from "../api-client";

const applyParamsToURL = (extra) => {
  let result = "";
  Object.keys(extra).forEach((key) => {
    result =
      result +
      "&" +
      key +
      "=" +
      (typeof extra[key] === "object"
        ? JSON.stringify(extra[key])
        : extra[key]);
  });
  return result;
};

export const getProductHashTags = (categoryId = "") => {
  return httpVendor.get(`/api/brand/filter/tag?category_id=${categoryId}`);
};

export const fetchSubCategories = (categoryId) => {
  return httpVendor.get(`/api/categories?category_id=${categoryId}`);
};

export const fetchTypes = (categoryId) => {
  return httpVendor
    .get(`/api/categories/vendor/categories-types/${categoryId}`)
    .then(
      (res) =>
        res.data && res.data[0] && res.data[0][0] && res.data[0][0]["types"]
    )
    .catch((err) => {
      throw err;
    });
};

export const productDetail = (id) => {
  return httpVendor
    .get(`api/vendor/product/details?id=${id}`)
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

export const productStatusUpdate = (data) => {
  return httpVendor.post("api/vendor/product/status/change", {
    enable: data.enable,
    product_id: data.id,
  });
};

export const getInventoryList = (productId) => {
  return httpVendor.get(`/api/product/inventory/list?product_id=${productId}`);
};

export const creditInventory = (inventoryData) => {
  return httpVendor.post("/api/product/inventory/credit", inventoryData);
};

export const debitInventory = (inventoryData) => {
  return httpVendor.post("/api/product/inventory/debit", inventoryData);
};

export const updateProductStockOut = (data) => {
  return httpVendor.post("api/vendor/product/mark/stockout", {
    product_id: data.id,
    stock_out: data.stock_out,
  });
};

export const updateProductAllowReturnable = (data) => {
  return httpVendor.post("api/vendor/product/allow-return-status", {
    product_id: data.id,
    status: data.status,
  });
};

export const fetchCategories = () => {
  return httpVendor.get(`/api/categories`);
};

export const getVendorProducts = (start = 0, extra = {}) => {
  return httpVendor.get(
    `api/vendor/product/list?_start=${start}&_end=${start + 250}` +
      applyParamsToURL(extra)
  );
};

export const addProductPrice = (data) => {
  return httpVendor.post("/api/vendor/product/price/create", data);
};

export const updateProductPrice = (data) => {
  return httpVendor.post("/api/vendor/product/price/edit", data);
};

export const deleteProductPrice = (data) => {
  return httpVendor.post("/api/vendor/product/price/delete", data);
};

export const fetchProductPrice = (id) => {
  return httpVendor.get(`/api/vendor/product/price/list?product_id=${id}`);
};

export const productCreate = (formData) => {
  return httpVendor.post("/api/vendor/product/v2/create", formData);
};

export const productEdit = (productId, data) => {
  return httpVendor.post(`/api/vendor/product/v2/edit/${productId}`, data);
};

export const bulkQA = (data) => {
  return httpVendor.post("/api/vendor/productqa/bulk", {
    product_id: data.productId,
    qa_list: data.questionAnswers,
  });
};

export const getBulkQAs = (productId) => {
  return httpVendor.get(`/api/vendor/productqa?product_id=${productId}`);
};

export const updateBulkQA = (data) => {
  return httpVendor.put("/api/vendor/productqa/bulk", data);
};

export const deleteQA = (id) => {
  return httpVendor.delete(`/api/vendor/productqa?qa_id=${id}`);
};
