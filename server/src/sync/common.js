import {
  executeWithRetry,
  getInventoryStatus,
  getProductItemModel,
} from "../common/index.js";
import { getInventory, getPrice } from "../common/pu.js";
import { downloadInventoryFile, readInventoryFile } from "../ftp/index.js";
import { bigCommerceInstance, wpsInstance } from "../instances/index.js";
import { puSearchInstance, puSearchLogin } from "../instances/pu-search.js";
import { updateProductItemModel } from "../models/Inventory.js";
import { turnMiddleLayerModel } from "../models/turnMiddleLayer.js";
import { updateStatusModel } from "../models/updateStatus.js";
import { sendNotification } from "../routes/tg-notifications.js";
import { updateProductItem } from "../routes/inventory.js";

export const beforeUpdateProducts = async (vendor, query = {}) => {
  if (Object.keys(query).length) {
    await resetProductsForSync();
    await setProductsForSync(vendor, query);
  }

  if (vendor == "HH" || vendor == "LS" || vendor == "TORC") {
    await downloadInventoryFile(vendor);
  }

  if (vendor == "PU") {
    await puSearchLogin();
  }
  try {
    await setUpdateStatus(true, `Updating ${vendor} products`);
  } catch (error) {
    throw error;
  }
};

export const afterUpdateProducts = async (
  vendor,
  query = {},
  processedProducts
) => {
  // query = JSON.stringify(query, null, 2);
  // sendNotification(
  //   `${vendor} products updated. \n Total: ${processedProducts}, \n Query: ${query}`
  // );
  try {
    await setUpdateStatus(
      false,
      `${vendor} products updated (${processedProducts})`
    );
  } catch (error) {
    throw error;
  }
};

const setProductsForSync = async (vendor, query) => {
  const Model = getProductItemModel(vendor);
  const productsToCopy = await Model.find(query);

  const BATCH_SIZE = 5000;

  for (let i = 0; i < productsToCopy.length; i += BATCH_SIZE) {
    const batch = productsToCopy.slice(i, i + BATCH_SIZE);
    await updateProductItemModel.insertMany(batch);
  }
};

const resetProductsForSync = async () => {
  try {
    await updateProductItemModel.deleteMany({});
  } catch (error) {
    sendNotification(`resetProductsForSync: ${error}`);
    throw error;
  }
};

export const setUpdateStatus = async (isUpdating, updateStatus) => {
  try {
    const doc = await updateStatusModel.findOneAndUpdate(
      {
        _id: "64f8ba198ab49ac6b3604b5b",
      },
      {
        is_updating: isUpdating,
        update_status: updateStatus,
      },
      { new: true }
    );
    return { is_updating: doc.is_updating, update_status: doc.update_status };
  } catch (error) {
    throw error;
  }
};

export const getUpdateStatus = async () => {
  try {
    const doc = await updateStatusModel.findOne({
      _id: "64f8ba198ab49ac6b3604b5b",
    });
    return { is_updating: doc.is_updating, update_status: doc.update_status };
  } catch (error) {
    throw error;
  }
};

export const setRebuildTurnStatus = async (isUpdating, updateStatus) => {
  try {
    const doc = await updateStatusModel.findOneAndUpdate(
      {
        _id: "675a7d2473e8bf907890abf8",
      },
      {
        is_updating: isUpdating,
        update_status: updateStatus,
      },
      { new: true }
    );
    return { is_updating: doc.is_updating, update_status: doc.update_status };
  } catch (error) {
    throw error;
  }
};

export const getRebuildTurnStatus = async () => {
  try {
    const doc = await updateStatusModel.findOne({
      _id: "675a7d2473e8bf907890abf8",
    });
    return { is_updating: doc.is_updating, update_status: doc.update_status };
  } catch (error) {
    throw error;
  }
};

export const getSyncedProducts = async (vendor, query = {}, page = 1) => {
  let Model;
  // if Sync with params

  if (Object.keys(query).length) {
    Model = updateProductItemModel;
  } else {
    Model = getProductItemModel(vendor);
  }

  const options = {
    page: page,
    limit: 50,
    lean: true,
    leanWithId: false,
  };
  try {
    const result = await Model.paginate(query, options);
    return {
      syncedProducts: result.docs,
      nextPage: result.nextPage,
    };
  } catch (error) {
    throw error;
  }
};

export const compareProducts = async (syncedProducts, vendorProducts, bulk) => {
  const productsForUpdate = [];
  const vendorProductsMap = vendorProducts.reduce((acc, product) => {
    acc[product.sku] = product;
    return acc;
  }, {});
  syncedProducts.forEach((product) => {
    let vendorProduct = vendorProductsMap[product.sku];
    // not found
    if (!vendorProduct) {
      vendorProduct = product;
      vendorProduct.update_status = "error";
      vendorProduct.update_log = "vendor product not found";
      vendorProduct.inventory_level = 0;
      productsForUpdate.push(vendorProduct);
      return;
    }

    vendorProduct.item_id = product.item_id;

    // bulk
    if (bulk) {
      vendorProduct.update_status = "updated";
      vendorProduct.update_log = "bulk updated";
      productsForUpdate.push(vendorProduct);
      return;
    }
    if (
      product.inventory_level !== vendorProduct.inventory_level ||
      product.price !== vendorProduct.price ||
      product.discontinued !== vendorProduct.discontinued
    ) {
      vendorProduct.update_status = "updated";
      vendorProduct.update_log = "";
    } else {
      vendorProduct.update_status = "no changes";
      vendorProduct.update_log = "";
    }
    productsForUpdate.push(vendorProduct);
  });

  return productsForUpdate;
};

export const updateProducts = async (vendor, productsForUpdate) => {
  let productsForBigcommerceUpdate = productsForUpdate
    .filter(
      (product) =>
        product.update_status === "updated" || product.update_status === "error"
    )
    .map((product) => {
      product.id = product.item_id;

      // Check if price is NaN or zero and set inventory_level accordingly
      if (isNaN(product.price) || product.price === 0) {
        product.price = 0;
        product.inventory_level = 0;
      } else if (isNaN(product.inventory_level)) {
        // If price is valid but inventory_level is NaN, only set inventory_level to zero
        product.inventory_level = 0;
      }

      return product;
    });

  try {
    const response = await Promise.all([
      updateProductsBigcommerce(vendor, productsForBigcommerceUpdate),
      updateInventoryProducts(vendor, productsForUpdate),
    ]);
    return response;
  } catch (error) {
    throw error;
  }
};

const extractIdsFromErrors = (errors) => {
  return Object.keys(errors)
    .map((key) => {
      const idString = errors[key];
      const idMatch = idString.match(/id (\d+)/);
      return idMatch ? idMatch[1] : null;
    })
    .filter((id) => id !== null);
};

const updateProductsWithErrors = async (vendor, productsWithErrors) => {
  const updatePromises = productsWithErrors.map(async (product) => {
    return await updateProductItem(vendor, product.sku);
  });

  await Promise.all(updatePromises);
};

const updateProductsBigcommerce = async (
  vendor,
  productsForBigcommerceUpdate
) => {
  if (!productsForBigcommerceUpdate.length) return;
  try {
    const response = await bigCommerceInstance.put(
      `/catalog/variants`,
      productsForBigcommerceUpdate
    );
    return response.data.length;
  } catch (error) {
    const bodyJson = JSON.parse(error.responseBody);
    const errorIds = extractIdsFromErrors(bodyJson.errors);

    const productsWithErrors = productsForBigcommerceUpdate.filter((product) =>
      errorIds.includes(String(product.id))
    );

    await updateProductsWithErrors(vendor, productsWithErrors);

    sendNotification(`updateProductsBigcommerce error: ${error}`);
  }
};
const updateInventoryProducts = async (vendor, productsForUpdate) => {
  const Model = getProductItemModel(vendor);

  const bulkOps = productsForUpdate.map((product) => ({
    updateOne: {
      filter: { sku: product.sku },
      update: {
        sku: product.sku,
        inventory_level: product.inventory_level,
        inventory_status: getInventoryStatus(product.inventory_level),
        update_status: product.update_status,
        update_log: product.update_log,
        price: product.price,
        discontinued: product.discontinued,
      },
    },
  }));

  try {
    const response = await Model.bulkWrite(bulkOps);
    return response.modifiedCount;
  } catch (error) {
    throw error;
  }
};

export const getVendorProducts = async (vendor, syncedProducts) => {
  const skus = syncedProducts.map((product) => product.sku);
  let products;

  // vendor connection point

  switch (vendor) {
    case "PU":
      products = await getPuProducts(skus);
      break;
    case "WPS":
      products = await getWPSProducts(skus);
      break;
    case "HH":
      products = await getHHProducts(skus);
      break;
    case "LS":
      products = await getLSProducts(skus);
      break;
    case "TURN":
      products = await getTURNProducts(skus);
      break;
    case "TORC":
      products = await getTORCProducts(skus);
    default:
      break;
  }
  return products;
};

// vendor connection point

// wps 10 products limit helper
async function getAllWPSProducts(skus) {
  const chunkSize = 10;
  const chunks = [];
  for (let i = 0; i < skus.length; i += chunkSize) {
    chunks.push(skus.slice(i, i + chunkSize));
  }

  const requestPromises = chunks.map((chunk) => {
    return executeWithRetry(() => {
      return wpsInstance
        .get(`/items?include=inventory&filter[sku]=${chunk.join(",")}`)
        .then((response) => response.data.data)
        .catch((error) => {
          console.log(
            `WPS products error for chunk ${chunk.join(",")}: ${error}`
          );
          return [];
        });
    });
  });

  const allWPSProductsArray = await Promise.all(requestPromises);
  const allWPSProducts = [].concat(...allWPSProductsArray);

  return allWPSProducts;
}

const getWPSProducts = async (skus) => {
  let products = await getAllWPSProducts(skus);
  products = products.map((product) => {
    return {
      sku: product.sku,
      inventory_level: product.inventory?.data?.total || 0,
      price: +product.list_price,
      discontinued: product.status === "DSC" ? true : false,
    };
  });
  return products;
};

const getPuProducts = async (skus) => {
  let response;
  let payload = {
    filters: [
      {
        matches: [
          {
            matches: [
              {
                path: "partNumber.verbatim",
                values: skus,
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
  try {
    response = await executeWithRetry(() => puSearchInstance(payload));
    let products = response.data.result.hits;
    products = products.map((item) => {
      let price = getPrice(item.prices);
      let inventory = getInventory(item.inventory);
      if (
        price === 0 ||
        item.access.notForSale ||
        item.access.unavailableForPurchase
      ) {
        inventory = 0;
      }
      return {
        sku: item.partNumber,
        inventory_level: inventory,
        price: price,
        discontinued: item.status === "DISCONTINUED" ? true : false,
      };
    });
    return products;
  } catch (error) {
    sendNotification(`${skus.join(", ")}. Error: ${error}`);
    throw error;
  }
};

const getHHProducts = async (skus) => {
  try {
    let response = await readInventoryFile("HH");
    let products = skus
      .map((sku) => {
        return response.find(
          (product) => product && product["Part Number"] == sku
        );
      })
      .filter((product) => product !== undefined);

    products = products.map((product) => {
      return {
        sku: product["Part Number"],
        inventory_level: +product["TTL Qty"],
        price: +product["Retail"],
        discontinued: product["Status"] === "Discontinued" ? true : false,
      };
    });
    return products;
  } catch (error) {
    sendNotification(`${skus.join(", ")}. Error: ${error}`);
    throw error;
  }
};

const getLSProducts = async (skus) => {
  try {
    let response = await readInventoryFile("LS");
    let products = skus
      .map((sku) => {
        return response.find(
          (product) => product && product["PartNumber"] == sku
        );
      })
      .filter((product) => product !== undefined);

    products = products.map((product) => {
      return {
        sku: product["PartNumber"],
        inventory_level: +product["In Stock"],
        price: +product["RetailPrice"],
        discontinued: product["Is Discontinued"] === "True" ? true : false,
      };
    });
    return products;
  } catch (error) {
    sendNotification(`${skus.join(", ")}. Error: ${error}`);
    throw error;
  }
};

const getTURNProducts = async (skus) => {
  try {
    const productsFromDb = await turnMiddleLayerModel
      .find({ sku: { $in: skus } })
      .lean();

    const products = productsFromDb.map((product) => ({
      sku: product.sku,
      inventory_level: product.inventory_level,
      price: product.price,
      discontinued: product.discontinued,
    }));

    return products;
  } catch (error) {
    sendNotification(`${skus.join(", ")}. Error: ${error}`);
    throw error;
  }
};

const getTORCProducts = async (skus) => {
  try {
    let response = await readInventoryFile("TORC");
    let products = skus
      .map((sku) => {
        return response.find((product) => product && product["SKU"] == sku);
      })
      .filter((product) => product !== undefined);

    products = products.map((product) => {
      const price = parseFloat(product.Price_Retail.replace("$", ""));

      return {
        sku: product["SKU"],
        inventory_level: +product["Qty Avail Now"],
        price: price,
        discontinued: product["Status"] === "Discontinued" ? true : false,
      };
    });
    return products;
  } catch (error) {
    sendNotification(`${skus.join(", ")}. Error: ${error}`);
    throw error;
  }
};
