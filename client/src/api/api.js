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
  getCategories(query) {
    return instance
      .get(`products/categories?name:like=${query}`)
      .then((response) => {
        return response;
      });
  },
};

export const chatgptAPI = {
  createSEO(title, description) {
    return instance
      .post(`/gpt/create-seo/`, {
        title,
        description,
      })
      .then((response) => {
        return response.data;
      });
  },
};

export const inventoryAPI = {
  getProducts(vendor, query, page) {
    return instance
      .get(`/inventory/products/`, {
        params: {
          vendor,
          query,
          page,
        },
      })
      .then((response) => {
        return response.data;
      });
  },
  updateProducts(vendor, query, bulk) {
    return instance
      .patch(`/inventory/sync/`, {
        vendor,
        query,
        bulk,
      })
      .then((response) => {
        return response.data;
      });
  },
  updateProductsStatus() {
    return instance.get(`/inventory/sync-status/`).then((response) => {
      return response.data;
    });
  },
};

export const puDropshipAPI = {
  getOrders(from, to, page) {
    return instance
      .get(`/pu-dropship/orders/`, {
        params: {
          from,
          to,
          page,
        },
      })
      .then((response) => {
        return response.data;
      });
  },
};

export const wpsDropshipAPI = {
  getOrders(from, to, page) {
    return instance
      .get(`/wps-dropship/orders/`, {
        params: {
          from,
          to,
          page,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => console.log(err));
  },
};

export const dashboardAPI = {
  getTotals() {
    return instance.get(`/dashboard/info`).then((response) => {
      return response.data;
    });
  },
};

export const ordersAPI = {
  getOrders(page) {
    return instance
      .get(`/dropship/orders/`, {
        params: {
          page,
        },
      })
      .then((response) => {
        return response.data;
      });
  },
  createOrder(id) {
    return instance.post(`/dropship/order/`, { id }).then((response) => {
      return response.data;
    });
  },
};

export const catalogAPI = {
  getProducts(vendor, offset, search) {
    return instance
      .get(`/catalog/products/`, {
        params: {
          vendor,
          offset,
          search,
        },
      })
      .then((response) => {
        return response.data;
      });
  },
  getProduct(vendor, id, search, link) {
    return instance
      .get(`/catalog/product/`, {
        params: {
          vendor,
          id,
          search,
          link,
        },
      })
      .then((response) => {
        return response.data;
      });
  },
};

export const categoryMappingAPI = {
  getCategories(vendor, query, page) {
    return instance
      .get(`/category/mapping/`, {
        params: {
          vendor,
          query,
          page,
        },
      })
      .then((response) => {
        return response.data;
      });
  },
  updateCategory(vendor, data) {
    return instance
      .put(`/category/mapping/`, {
        vendor,
        data,
      })
      .then((response) => {
        return response.data;
      });
  },
  deleteCategory(vendor, data) {
    return instance
      .delete(`/category/mapping/`, {
        data: {
          vendor,
          data,
        },
      })
      .then((response) => {
        return response.data;
      });
  },
  createCategory(vendor, data) {
    return instance
      .post(`/category/mapping/`, {
        vendor,
        data,
      })
      .then((response) => {
        return response.data;
      });
  },
};
