import { delay } from "../common/index.js";
import { turnInstance } from "../instances/turn-instance.js";
import { turnMiddleLayerModel } from "../models/turnMiddleLayer.js";

const getItemsData = async (page = 1) => {
  try {
    const response = await turnInstance.get(`/items/data?page=${page}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

const updateItemsDataInBatch = async (items) => {
  const operations = items.map((item) => {
    const images = item.files
      ? item.files
          .filter((file) => file.type === "Image")
          .map((file) => file.links[0]?.url)
      : [];

    const description = item.descriptions
      ? item.descriptions.map((desc) => desc.description).join(" ")
      : "";

    const videoFile = item.files
      ? item.files.find((file) => file.type === "Video")
      : null;
    const videoUrl = videoFile?.links[0]?.url || "";
    const videoCodeMatch = videoUrl.match(/v=([\w-]+)/);
    const video = videoCodeMatch ? videoCodeMatch[1] : null;

    const { id, ...updateData } = {
      id: item.id,
      images,
      description,
      video,
    };

    return {
      updateOne: {
        filter: { id },
        update: { $set: updateData },
        upsert: true,
      },
    };
  });
  try {
    await turnMiddleLayerModel.bulkWrite(operations);
  } catch (error) {
    throw error;
  }
};

const getItems = async (page = 1) => {
  try {
    const response = await turnInstance.get(`/items?page=${page}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

const createItemsInBatch = async (items) => {
  const itemsToCreate = items.map((item) => ({
    id: item.id,
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
      console.log(`Error create items: ${error}`);
      throw error;
    }
  }
};

const updateItems = async (items, f) => {
  const batchSize = 50;
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    console.log("before f");
    await f(batch);
    await delay(200);
  }
};

const createItems = async (items) => {
  const batchSize = 50;
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await createItemsInBatch(batch);
    // await delay(200);
  }
};

export const addItemsToDatabase = async () => {
  let totalPages = 513;
  let page = 1;
  for (let i = page; i <= totalPages; i++) {
    const items = await getItems(page);
    await createItems(items);
    await delay(200);
    console.log(page);
    page++;
  }
  console.log(`Total items created: ${totalItemsCreated}`);
};

export const addItemsDataToDatabase = async () => {
  let totalPages = 1137;
  let page = 1;
  for (let i = page; i <= totalPages; i++) {
    const items = await getItemsData(page);
    console.log("get");
    await updateItems(items, updateItemsDataInBatch);
    console.log("update");
    await delay(200);
    console.log(page);
    page++;
  }
};
