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

export const puInventoryAPI = {
  getProducts(name, page, status, search) {
    return instance
      .get(`/pu-inventory/products/`, {
        params: {
          name,
          page,
          status,
          search,
        },
      })
      .then((response) => {
        return response.data;
      });
  },
  updateProducts(vendor_id, name, status) {
    return instance
      .get(`/inventory/sync/`, {
        params: {
          vendor: "PU",
          vendor_id,
          name,
          status,
        },
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

export const hhProductsAPI = {
  getProducts(name, page) {
    return instance
      .get(`/hh/products/`, {
        params: {
          name,
          page,
        },
      })
      .then((response) => {
        return response.data;
      });
  },
};

export const hhProductAPI = {
  getProduct(link) {
    return instance
      .get(`/hh/product/`, {
        params: {
          link,
        },
      })
      .then((response) => {
        return response.data;
      });
  },
};

export const hhInventoryAPI = {
  getProducts(name, page, status, search) {
    return instance
      .get(`/hh-inventory/products/`, {
        params: {
          name,
          page,
          status,
          search,
        },
      })
      .then((response) => {
        return response.data;
      });
  },
  updateProducts(vendor_id, name, status) {
    return instance
      .get(`/inventory/sync/`, {
        params: {
          vendor_id,
          name,
          status,
          vendor: "HH",
        },
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
