import { generateProductName } from "../../../common/index.js";
import { createOptions, removeDuplicateWords } from "../common.js";
import { turnInstance } from "../../../instances/turn-instance.js";
import { turnSearch } from "../../../instances/turn-search.js";

const fetchData = async (id, search) => {
  try {
    const product = await Promise.all([
      turnInstance.get(`/items/${id}`),
      turnInstance.get(`/items/data/${id}`),
    ]);
    return {
      product: product[0].data.data,
      data: product[1].data.data[0],
    };
  } catch (error) {
    console.log(error);
    return error;
  }
};

const createProduct = (obj) => {
  const description = obj.data.descriptions
    .map((text) => {
      return `<p><strong>${text.type}</strong><br> ${text.description}</p>`;
    })
    .join("");

  const variants = [];
  return {
    vendor: "TURN",
    vendor_id: obj.product.id,
    name: generateProductName(
      obj.product.attributes.brand,
      obj.product.attributes.part_description
    ),
    type: "physical",
    weight: 0,
    price: 0,
    description: description,
    brand_name: obj.product.attributes.brand,
    inventory_tracking: "variant",
    variants: variants,
    images: [],
    search_available: true,
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
