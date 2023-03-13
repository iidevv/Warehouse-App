import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
  },
});

export const dmgProductAPI = {
  getProducts(currentPage, pageSize) {
    return instance
      .get(`/products/list?page=${currentPage}&limit=${pageSize}`)
      .then((response) => {
        return response.data;
      });
  },
};