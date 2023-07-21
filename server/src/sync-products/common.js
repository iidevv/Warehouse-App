import { bigCommerceInstance, wpsInstance } from "../instances/index.js";
import { InventoryModel } from "../models/Inventory.js";
import { puInventoryModel } from "../models/puInventory.js";
import { sendNotification } from "../routes/tg-notifications.js";
import { createNewDate } from "../common/index.js";
import { puSearchInstance } from "../instances/pu-search.js";

// Helper function to process array items in parallel with a limited concurrency
export const asyncForEach = async (array, callback, concurrency = 5) => {
  const queue = [...array];
  const promises = [];
  while (queue.length) {
    while (promises.length < concurrency && queue.length) {
      const item = queue.shift();
      promises.push(callback(item));
    }
    await Promise.race(promises).then((completed) => {
      promises.splice(promises.indexOf(completed), 1);
    });
  }
  return Promise.all(promises);
};

// Helper function to execute a function with retries
export const executeWithRetry = async (fn, maxRetries = 3, delay = 10000) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      retries++;
      console.error(`Attempt ${retries} failed. Retrying...`, error);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries reached.");
};

// switchers
const getModel = (vendor) => {
  let model;
  switch (vendor) {
    case "PU":
      model = puInventoryModel;
      break;
    case "WPS":
      model = InventoryModel;
      break;

    default:
      break;
  }
  return model;
};

export const getProduct = async (id, name, vendor) => {
  let product;
  switch (vendor) {
    case "PU":
      product = await getPuProduct(id, name);
      break;
    case "WPS":
      product = await getWPSProduct(id, name);
      break;

    default:
      break;
  }
  return product;
};
// vendors
const getWPSProduct = async (id, name) => {
  return await wpsInstance
    .get(`/products/${id}/?include=items.inventory`)
    .then((response) => {
      const product = response.data.data;
      return {
        id: product.id,
        price: +product.items.data[0].list_price,
        variants: product.items.data.map((item) => {
          let is_available = false;
          if (item.inventory.data && +item.list_price !== 0) {
            is_available = true;
          }
          return {
            id: item.id,
            sku: item.sku,
            price: +item.list_price,
            inventory_level: is_available ? item.inventory.data.total : 0,
          };
        }),
      };
    })
    .catch((error) => {
      return error;
    });
};
const getPuProduct = async (id, name) => {
  try {
    let response;
    // get all variants sku's
    const product = await getSyncedProduct(id, name, "PU");
    const incorporatingPartNumbers = product.variants.map((v) => v.vendor_id);
    // get all variants
    let payload = {
      filters: [
        {
          matches: [
            {
              matches: [
                {
                  path: "partNumber.verbatim",
                  values: incorporatingPartNumbers,
                },
              ],
              operator: "OR",
            },
          ],
          operator: "OR",
        },
      ],
      pagination: {
        limit: 50,
      },
      partActiveScope: "ALL",
    };
    response = await puSearchInstance(payload);

    const items = response.data.result.hits;

    const data = items[0];
    const price =
      data?.prices?.retail ||
      data?.prices?.originalRetail ||
      (data?.prices?.originalBase !== undefined
        ? data.prices.originalBase + data.prices.originalBase * 0.35
        : 0) ||
      0;

    const variants = incorporatingPartNumbers.map((partNumber) => {
      const item = items.find((item) => item.partNumber === partNumber);

      const price =
        item?.prices?.retail ||
        item?.prices?.originalRetail ||
        (item?.prices?.originalBase !== undefined
          ? item.prices.originalBase + item.prices.originalBase * 0.35
          : 0) ||
        0;
      let inventoryLevel = item
        ? item.inventory.locales.reduce(
            (total, local) => total + (local.quantity || 0),
            0
          )
        : 0;
      if (
        data?.access?.notForSale ||
        data?.access?.unavailableForPurchase ||
        price == 0
      ) {
        inventoryLevel = 0;
      }
      if (!data?.access?.notForSale) {
        sendNotification(`sku: ${partNumber}. No notForSale value`);
      }
      return {
        id: partNumber,
        sku: partNumber,
        price: price,
        inventory_level: inventoryLevel,
      };
    });

    return {
      id: data.product.id,
      price: price,
      variants: variants,
    };
  } catch (error) {
    throw error;
  }
};
// common

export const updateBigcommerceProduct = async (id, data) => {
  return await bigCommerceInstance
    .put(`/catalog/products/${id}`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export const updateBigcommerceProductVariants = async (id, variants) => {
  let message = "";

  for (let variant of variants) {
    try {
      await bigCommerceInstance.put(
        `/catalog/products/${id}/variants/${variant.id}`,
        variant
      );
      // Add delay
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.log(`${variant.id} - error;`);
      message = "Error";
      sendNotification(
        `Product: ${id}, variant: ${variant.sku} (updateBigcommerceProductVariants Error)`
      );
    }
  }
  return message;
};

export const getSyncedProducts = async (
  vendor_id,
  name,
  page,
  pageSize,
  status,
  vendor
) => {
  let model = getModel(vendor);
  if (vendor_id && name) {
    return getSyncedProduct(vendor_id, name, vendor);
  }
  let query = {};
  if (status) {
    query.status = status;
  }

  try {
    const total = await model.countDocuments(query);
    const totalPages = Math.ceil(total / pageSize);
    const skip = (page - 1) * pageSize;

    const products = await model.find(query).skip(skip).limit(pageSize);
    return {
      products,
      total,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    sendNotification(`getSyncedProducts Error: ${error}`);
  }
};

export const getSyncedProduct = async (vendor_id, name, vendor) => {
  let model = getModel(vendor);
  try {
    const product = await model.findOne({
      // vendor_id,
      product_name: name,
    });
    return product;
  } catch (error) {
    sendNotification(`${vendor}, ${name}. getSyncedProduct Error: ${error} `);
  }
};

export const updateSyncedProduct = async (updatedProductData, vendor) => {
  let model = getModel(vendor);
  try {
    const product = await model.findOne({
      // vendor_id: updatedProductData.id,
      product_name: updatedProductData.product_name,
    });
    if (product) {
      if (product.price !== updatedProductData.price) {
        product.price = updatedProductData.price;
      }

      if (product.status !== updatedProductData.status) {
        product.status = updatedProductData.status;
      }

      for (const updatedVariant of updatedProductData.variants) {
        // Find the matching variant in the product
        const productVariantIndex = product.variants.findIndex(
          (variant) => variant.vendor_id == updatedVariant.id
        );

        if (productVariantIndex !== -1) {
          if (
            product.variants[productVariantIndex].variant_price !==
            updatedVariant.price
          ) {
            product.variants[productVariantIndex].variant_price =
              updatedVariant.price;
          }

          if (
            product.variants[productVariantIndex].inventory_level !==
            updatedVariant.inventory_level
          ) {
            product.variants[productVariantIndex].inventory_level =
              updatedVariant.inventory_level;
          }
        }
      }

      product.last_updated = createNewDate();
      await product.save();
      return { Message: "updated!" };
    } else {
      sendNotification(`Product not found: ${updatedProductData.product_name}`);
      return { Error: "Product not found" };
    }
  } catch (error) {
    sendNotification(
      `${vendor}, ${updatedProductData.product_name}. updateSyncedProduct Error: ${error}`
    );
    return { error: error };
  }
};
