import { executeWithRetry, getProductItemModel } from "../common/index.js";
import { bigCommerceInstance, wpsInstance } from "../instances/index.js";
import { puSearchLogin } from "../instances/pu-search.js";
import { sendNotification } from "../routes/tg-notifications.js";
import { downloadInventoryFile } from "../sync-products/ftp.js";

export const beforeUpdateProducts = async (vendor) => {
  if (vendor == "HH" || vendor == "LS") {
    await downloadInventoryFile(vendor);
  }
  if (vendor == "PU") {
    await puSearchLogin();
  }
};

export const getSyncedProducts = async (vendor, page = 1, query = {}) => {
  const Model = getProductItemModel(vendor);
  const options = {
    page: page,
    limit: 50,
    lean: true,
    leanWithId: false,
  };

  const result = await Model.paginate(query, options);
  return {
    syncedProducts: result.docs,
    totalPages: result.totalPages,
    nextPage: result.nextPage,
  };
};

export const getVendorProducts = async (vendor, syncedProducts) => {
  const skus = syncedProducts.map((product) => product.sku);
  let products;

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
    default:
      break;
  }
  return products;
};

export const compareProducts = async (syncedProducts, vendorProducts, bulk) => {
  const productsForUpdate = [];
  const vendorProductsMap = vendorProducts.reduce((acc, product) => {
    acc[product.sku] = product;
    return acc;
  }, {});

  syncedProducts.forEach((product) => {
    const vendorProduct = vendorProductsMap[product.sku];

    if (!vendorProduct) {
      sendNotification(
        `Product with SKU ${product.sku} not found in vendor products.`
      );
      return;
    }
    if (bulk) {
      vendorProduct.id = product.item_id;
      productsForUpdate.push(vendorProduct);
    } else if (
      product.inventory_level !== vendorProduct.inventory_level ||
      product.price !== vendorProduct.price ||
      product.discontinued !== vendorProduct.discontinued
    ) {
      vendorProduct.id = product.item_id;
      productsForUpdate.push(vendorProduct);
    }
  });

  return productsForUpdate;
};
export const updateProducts = async (vendor, productsForUpdate) => {
  try {
    const response = await Promise.all([
      updateProductsBigcommerce(productsForUpdate),
      updateInventoryProducts(vendor, productsForUpdate),
    ]);
    if (response[0].length !== response[1].length) {
      sendNotification(
        `${vendor} updateProducts error ${productsForUpdate
          .map((product) => product.sku)
          .join(", ")}`
      );
    }
    return response;
  } catch (error) {
    throw error;
  }
};

const updateProductsBigcommerce = async (productsForUpdate) => {
  try {
    const response = await bigCommerceInstance.put(
      `/catalog/variants`,
      productsForUpdate
    );
    return response.data.length;
  } catch (error) {
    throw error;
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

// vendors

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
  try {
    let response;
    // get all variants sku's
    const product = await getSyncedProduct("PU", id, name);
    if (!product) {
      return;
    }
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
    if (items.length === 0) {
      return;
    }
    const data = items[0];
    const price =
      data?.prices?.retail ||
      data?.prices?.originalRetail ||
      (data?.prices?.originalBase !== undefined
        ? data.prices.originalBase + data.prices.originalBase * 0.35
        : 0) ||
      0;

    const variants = await Promise.all(
      incorporatingPartNumbers.map(async (partNumber) => {
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
        if (data?.access?.notForSale === undefined) {
          sendNotification(
            `${name}. sku: ${partNumber}. notForSale: ${data?.access?.notForSale}`
          );
          await puSearchLogin();
        }
        return {
          id: partNumber,
          sku: partNumber,
          price: price,
          inventory_level: inventoryLevel,
        };
      })
    );
    return {
      id: data.product.id,
      price: price,
      variants: variants,
    };
  } catch (error) {
    sendNotification(`${name}. Error: ${error}`);
    throw error;
  }
};
const getHHProducts = async (skus) => {
  try {
    let response;
    // get all variants sku's
    const product = await getSyncedProduct("HH", id, name);
    if (!product) {
      return;
    }
    const incorporatingPartNumbers = product.variants.map((v) => v.vendor_id);
    response = await readInventoryFile("HH");
    const items = incorporatingPartNumbers.map((partNumber) => {
      return response.find((item) => item && item["Part Number"] == partNumber);
    });
    if (items.length === 0) {
      return;
    }
    const data = items[0];
    const price = +data["Retail"];

    const variants = await Promise.all(
      incorporatingPartNumbers.map(async (partNumber) => {
        const item = items.find(
          (item) => item && item["Part Number"] === partNumber
        );

        const price = item ? +item["Retail"] : 0;
        let inventoryLevel = item ? +item["TTL Qty"] : 0;
        if (price == 0) {
          inventoryLevel = 0;
        }
        return {
          id: partNumber,
          sku: partNumber,
          price: price,
          inventory_level: inventoryLevel,
        };
      })
    );
    return {
      price: price,
      variants: variants,
    };
  } catch (error) {
    sendNotification(`${name}. Error: ${error}`);
    throw error;
  }
};
const getLSProducts = async (skus) => {
  try {
    let response;
    // get all variants sku's
    const product = await getSyncedProduct("LS", id, name);
    if (!product) {
      return;
    }
    const incorporatingPartNumbers = product.variants.map((v) => v.vendor_id);
    response = await readInventoryFile("LS");
    const items = incorporatingPartNumbers.map((partNumber) => {
      return response.find((item) => item && item["PartNumber"] == partNumber);
    });
    if (items.length === 0) {
      return;
    }
    const data = items[0];
    const price = +data["RetailPrice"];

    const variants = await Promise.all(
      incorporatingPartNumbers.map(async (partNumber) => {
        const item = items.find(
          (item) => item && item["PartNumber"] === partNumber
        );

        const price = item ? +item["RetailPrice"] : 0;
        let inventoryLevel = item ? +item["In Stock"] : 0;
        if (price == 0) {
          inventoryLevel = 0;
        }
        return {
          id: partNumber,
          sku: partNumber,
          price: price,
          inventory_level: inventoryLevel,
        };
      })
    );
    return {
      price: price,
      variants: variants,
    };
  } catch (error) {
    sendNotification(`${name}. Error: ${error}`);
    throw error;
  }
};
