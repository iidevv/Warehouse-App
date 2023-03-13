import axios from "axios";

const instance = axios.create({
  withCredentials: true,
  baseURL: "https://api.bigcommerce.com/stores/4n3dh09e13/v3/",
  headers: {
    "X-Auth-Client": "l2mq5ar7kg5fo5vcx8ohtlmdga7426s",
    "X-Auth-Token": "sfg3gi5tfc4abmzyyz4wpddvoq9opxl",
  },
});

export const dmgProductAPI = {
  getProducts(currentPage, pageSize) {
    return instance
      .get(`catalog/products?page=${currentPage}&limit=${pageSize}`)
      .then((response) => {
        return response.data;
      });
  },
};