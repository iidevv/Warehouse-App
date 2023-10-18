import {
  delay,
  executeWithRetry,
  getPriceWithPercentage,
} from "../common/index.js";
import { turnInstance } from "../instances/turn-instance.js";
import { turnMiddleLayerModel } from "../models/turnMiddleLayer.js";

const getItemsData = async (page = 1) => {
  try {
    const response = await executeWithRetry(async () => {
      const result = await turnInstance.get(`/items/data?page=${page}`);
      return result;
    });
    return response.data.data;
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

const getPrices = async (page = 1) => {
  try {
    const response = await turnInstance.get(`/pricing?page=${page}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

const getInventory = async (page = 1) => {
  try {
    const response = await turnInstance.get(`/inventory?page=${page}`);
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

const updateItemsDataInBatch = async (items) => {
  const operations = items.map((item) => {
    const images = item.files
      ? item.files
          .filter((file) => file.type === "Image")
          .map((file) => file.links[0]?.url)
      : [];
    const description = item.descriptions
      ? item.descriptions
          .filter((desc) => desc.type && desc.description)
          .map(
            ({ type, description }) =>
              `<p><strong>${type}</strong> ${description}</p>`
          )
          .join("")
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

const updateItemsPricesInBatch = async (items) => {
  const operations = items.map((item) => {
    const priceLookup = item.attributes.pricelists.reduce((acc, item) => {
      acc[item.name] = item.price;
      return acc;
    }, {});

    const price =
      priceLookup["MAP"] ||
      getPriceWithPercentage(priceLookup["Jobber"], 30) ||
      priceLookup["Retail"] ||
      0;

    const discontinued = !item.attributes.can_purchase;

    const updateData = {
      price,
      discontinued,
    };

    if (price == 0) {
      updateData.inventory_level = 0;
    }

    return {
      updateOne: {
        filter: { id: item.id },
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

const updateItemsInventoryInBatch = async (items) => {
  const operations = items.map((item) => {
    const inventory_level = Object.values(item.attributes.inventory).reduce(
      (acc, currentValue) => acc + currentValue,
      0
    );
    const { id, ...updateData } = {
      id: item.id,
      inventory_level,
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

const updateItems = async (items, f) => {
  try {
    const batchSize = 50;
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      await f(batch);
      await delay(200);
    }
  } catch (error) {
    throw error;
  }
};

const createItems = async (items) => {
  const batchSize = 50;
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await createItemsInBatch(batch);
    await delay(100);
  }
};

export const addItemsToDatabase = async (page) => {
  let totalPages = 513;
  for (let i = page; i <= totalPages; i++) {
    const items = await getItems(page);
    await createItems(items);
    await delay(200);
    console.log(page);
    page++;
  }
  console.log(`Total items created: ${totalItemsCreated}`);
};
export const addItemsDataToDatabase = async (page) => {
  let totalPages = 1137;
  try {
    for (let i = page; i <= totalPages; i++) {
      const startTime = Date.now();
      const items = await getItemsData(page);
      await updateItems(items, updateItemsDataInBatch);
      await delay(200);
      const endTime = Date.now();

      const elapsedTime = (endTime - startTime) / 1000;
      console.log(`Page: ${page}, Elapsed Time: ${elapsedTime} seconds`);
      page++;
    }
  } catch (error) {
    console.log(error);
  }
};

export const addItemsPricesToDatabase = async (page) => {
  let totalPages = 513;
  try {
    for (let i = page; i <= totalPages; i++) {
      const startTime = Date.now();
      const items = await getPrices(page);
      await updateItems(items, updateItemsPricesInBatch);
      await delay(200);
      const endTime = Date.now();

      const elapsedTime = (endTime - startTime) / 1000;
      console.log(
        `Page: ${page}, Elapsed Time: ${elapsedTime} seconds | Prices`
      );
      page++;
    }
  } catch (error) {
    console.log(error);
  }
};

export const addItemsInventoryToDatabase = async (page) => {
  let totalPages = 513;
  try {
    for (let i = page; i <= totalPages; i++) {
      const startTime = Date.now();
      const items = await getInventory(page);
      await updateItems(items, updateItemsInventoryInBatch);
      await delay(200);
      const endTime = Date.now();

      const elapsedTime = (endTime - startTime) / 1000;
      console.log(
        `Page: ${page}, Elapsed Time: ${elapsedTime} seconds | Inventory`
      );
      page++;
    }
  } catch (error) {
    console.log(error);
  }
};
