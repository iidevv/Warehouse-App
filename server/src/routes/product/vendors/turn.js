import { generateProductName } from "../../../common/index.js";
import { puSearchInstance } from "../../../instances/pu-search.js";
import { createOptions, removeDuplicateWords } from "../common.js";
import { turnInstance } from "../../../instances/turn-instance.js";
import util from "util";

const fetchData = async (id, search) => {
  try {
    const product = await turnInstance.get(`/items/${id}`);
    const data = await turnInstance.get(`/items/data/${id}`);
    return {
      product: product.data.data,
      data: data.data.data,
    };
  } catch (error) {
    console.log(error);
    return error;
  }
};

const createProduct = (obj) => {
  console.log(obj.product);
  const variants = [];
  return {
    vendor: "TURN",
    vendor_id: obj.product.id,
    name: generateProductName(obj.product.attributes.brand, obj.product.attributes.part_description),
    type: "physical",
    weight: 0,
    price: 0,
    description: "",
    brand_name: obj.product.attributes.brand,
    inventory_tracking: "variant",
    variants: variants,
    images: [],
  };
};

export const getTURNProduct = async (id, search) => {
  try {
    const productData = await fetchData(id, search);
    const product = createProduct(productData);
    return product;
  } catch (error) {
    return { error: error };
  }
};
