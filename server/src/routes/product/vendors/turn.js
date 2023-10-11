import { generateProductName } from "../../../common/index.js";
import { puSearchInstance } from "../../../instances/pu-search.js";
import { createOptions, removeDuplicateWords } from "../common.js";
import { turnInstance } from "../../../instances/turn-instance.js";

const fetchData = async (id, search) => {
  try {
    const response = await turnInstance.get(`/items/${id}`);
    console.log(response);
  } catch (error) {
    console.log(error);
    return error;
  }
};

const createProduct = (obj) => {};

export const getTURNProduct = async (id, search) => {
  try {
    const productData = await fetchData(id, search);
    const product = createProduct(productData);
    return product;
  } catch (error) {
    return { error: error };
  }
};
