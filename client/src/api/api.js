import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3001",
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
    return instance
      .get(`/inventory/sync/`)
      .then((response) => {
        return response.data;
      });
  },
};
