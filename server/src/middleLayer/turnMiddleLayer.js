import { delay } from "../common/index.js";
import { turnInstance } from "../instances/turn-instance.js";
import { turnMiddleLayerModel } from "../models/turnMiddleLayer.js";

const getItems = async (page) => {
  try {
    const response = await turnInstance.get(`/items?page=${page}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

const createItemsInBatch = async (items) => {
  const itemsToCreate = items.map((item) => ({
    id: +item.id,
    name: item.attributes.product_name,
    sku: item.attributes.part_number,
    category: `${item.attributes.category} > ${item.attributes.subcategory}`,
    brand: item.attributes.brand,
    upc: item.attributes?.barcode,
  }));

  try {
    await turnMiddleLayerModel.insertMany(itemsToCreate, { ordered: false });
  } catch (error) {
    if (error.code === 11000) {
      console.log("Duplicate key error");
    } else {
      throw error;
    }
  }
};

const createItems = async (items) => {
  const batchSize = 50;
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await createItemsInBatch(batch);
    await delay(200);
  }
};

export const addItemsToDatabase = async () => {
  let totalPages = 512;
  let page = 1;
  for (let i = page; i <= totalPages; i++) {
    const items = await getItems(page);
    await createItems(items);
    await delay(1000);
    page++;
    console.log(page);
  }
};
