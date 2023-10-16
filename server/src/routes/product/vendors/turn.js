import { delay, generateProductName } from "../../../common/index.js";
import { createOptions, removeDuplicateWords } from "../common.js";
import { turnInstance } from "../../../instances/turn-instance.js";
import { turnSearch } from "../../../instances/turn-search.js";

const fetchData = async (id, search) => {
  try {
    const product = await Promise.all([
      turnInstance.get(`/items/${id}`),
      turnInstance.get(`/items/data/${id}`),
    ]);
    const productData = {
      ...product[0].data.data,
      ...product[1].data.data[0],
    };

    let variants = [];
    if (search) {
      let responseVariants = await turnSearch(1, search);
      responseVariants = responseVariants.data.filter(
        (item) => item.id != productData.id
      );

      const delayBetweenRequests = 200;

      const variantsData = [];

      for (const variant of responseVariants) {
        const variantData = await turnInstance.get(`/items/data/${variant.id}`);
        variantsData.push(variantData.data.data[0]);
        await delay(delayBetweenRequests);
      }
      variants = variantsData;
    }
    return {
      product: productData,
      variants: variants,
    };
  } catch (error) {
    console.log(error);
    return error;
  }
};

const createProduct = (obj) => {
  console.log(obj);
  const description = obj.product.descriptions
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
