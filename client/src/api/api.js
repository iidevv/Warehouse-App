import axios from "axios";
const useHttps = process.env.REACT_APP_USE_HTTPS === "true";

export const instance = axios.create({
  baseURL: useHttps
    ? "https://warehouse.discountmotogear.com/api"
    : "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const dmgProductAPI = {
  getProducts(currentPage, pageSize) {
    return instance
      .get(`/products/list?page=${currentPage}&limit=${pageSize}`)
      .then((response) => {
        return response.data;
      });
  },
  createProduct(data) {
    return instance.post("products/create", data).then((response) => {
      return response;
    });
  },
  deleteProduct(id) {
    return instance
      .delete("products/delete", {
        params: { id },
      })
      .then((response) => {
        return response;
      });
  },
  getCategories(query) {
    return instance
      .get(`products/categories?name:like=${query}`)
      .then((response) => {
        return response;
      });
  },
};

export const wpsProductsAPI = {
  getProducts(name, cursor) {
    return instance
      .get(`/wps/products/`, {
        params: {
          name,
          cursor,
        },
      })
      .then((response) => {
        return response.data;
      });
  },
  getItems(searchby, keyword, cursor) {
    return instance
      .get(`/wps/items/`, {
        params: {
          searchby,
          keyword,
          cursor,
        },
      })
      .then((response) => {
        return response.data;
      });
  },
};

export const wpsProductAPI = {
  getProduct(id) {
    return instance
      .get(`/wps/product/`, {
        params: {
          id,
        },
      })
      .then((response) => {
        return response.data;
      });
  },
};

export const puProductsAPI = {
  getProducts(name, offset) {
    return instance
      .get(`/pu/products/`, {
        params: {
          name,
          offset,
        },
      })
      .then((response) => {
        return response.data;
      });
  },
};

export const puProductAPI = {
  getProduct(id, search) {
    return instance
      .get(`/pu/product/`, {
        params: {
          id,
          search,
        },
      })
      .then((response) => {
        return response.data;
      });
  },
};

export const chatgptAPI = {
  getText(s) {
    return instance
      .get(`/gpt/create-text/`, {
        params: {
          s,
        },
      })
      .then((response) => {
        return response.data;
      });
  },
};

export const inventoryAPI = {
  getProducts(name, page) {
    return instance
      .get(`/inventory/products/`, {
        params: {
          name,
          page,
        },
      })
      .then((response) => {
        return response.data;
      });
  },
  deleteProduct(id) {
    return instance
      .delete(`/inventory/products/`, {
        params: { id },
      })
      .then((response) => {
        return response.data;
      });
  },
  updateProducts() {
    return instance.get(`/inventory/sync/`).then((response) => {
      return response.data;
    });
  },
  updateProductsStatus() {
    return instance.get(`/inventory/sync-status/`).then((response) => {
      return response.data;
    });
  },
};

export const puInventoryAPI = {
  getProducts(name, page) {
    return instance
      .get(`/pu-inventory/products/`, {
        params: {
          name,
          page,
        },
      })
      .then((response) => {
        return response.data;
      });
  },
  deleteProduct(id) {
    return instance
      .delete(`/pu-inventory/products/`, {
        params: { id },
      })
      .then((response) => {
        return response.data;
      });
  },
  updateProducts() {
    return instance.get(`/pu-inventory/sync/`).then((response) => {
      return response.data;
    });
  },
  updateProductsStatus() {
    return instance.get(`/pu-inventory/sync-status/`).then((response) => {
      return response.data;
    });
  },
};
