import express from "express";
import {
  getInventoryProducts,
  updateInventoryProduct,
} from "../routes/pu-inventory.js";
import { bigCommerceInstance, puInstance } from "../instances/index.js";
import { puInventoryModel } from "../models/puInventory.js";

const getSyncedProducts = async (vendor_id, name, page, pageSize, status) => {
  return await getInventoryProducts(vendor_id, name, page, pageSize, status);
};

const getPuProduct = async (id, search) => {
  try {
    let response;
    // get all variants sku's
    const puInventory = await puInventoryModel.findOne({ vendor_id: id });
    const incorporatingPartNumbers = puInventory.variants.map(
      (v) => v.vendor_id
    );

    if (search) {
      let payload = {
        queryString: search,
        pagination: {
          limit: 50,
        },
      };
      response = await puInstance.post("parts/search/", payload);
    } else {
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
        partActiveScope: "ALL",
      };
      response = await puInstance.post(`parts/search/`, payload);
    }

    const items = response.data.result.hits;
    const data = items[0];
    const price =
      data.prices.retail ||
      data.prices.originalRetail ||
      data.prices.originalBase + data.prices.originalBase * 0.35;

    const variants = incorporatingPartNumbers.map((partNumber) => {
      const item = items.find((item) => item.partNumber === partNumber);
      const price =
        item?.prices.retail ||
        item?.prices.originalRetail ||
        item?.prices.originalBase + item?.prices.originalBase * 0.35 ||
        0;
      const inventoryLevel = item
        ? item.inventory.locales.reduce(
            (total, local) => total + (local.quantity || 0),
            0
          )
        : 0;
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

const getSyncedProduct = async (vendor_id, name) => {
  return await getInventoryProducts(vendor_id, name, "", "");
};

const updateBigcommerceProduct = async (id, data) => {
  return await bigCommerceInstance
    .put(`/catalog/products/${id}`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

const updateBigcommerceProductVariants = async (id, variants) => {
  const promises = variants.map((variant) => {
    return bigCommerceInstance
      .put(`/catalog/products/${id}/variants/${variant.id}`, variant)
      .then(() => {
        return `${variant.id} - updated;`;
      })
      .catch(() => {
        return `${variant.id} - error;`;
      });
  });

  const messages = await Promise.all(promises);
  return { message: messages.join(" ") };
};

const updateSyncedProduct = async (data) => {
  return await updateInventoryProduct(data);
};

let updateStatus = false;

// Helper function to process array items in parallel with a limited concurrency
async function asyncForEach(array, callback, concurrency = 5) {
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
}

// Helper function to execute a function with retries
async function executeWithRetry(fn, maxRetries = 3, delay = 10000) {
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
}

export const updatePuProducts = (vendor_id, name, status) => {
  return new Promise(async (resolve, reject) => {
    const pageSize = 5;
    let currentPage = 1;
    let totalPages = 1;
    let errors = []; // Add this to keep track of errors

    while (currentPage <= totalPages) {
      try {
        const response = await executeWithRetry(() =>
          getSyncedProducts(vendor_id, name, currentPage, pageSize, status)
        );

        let productsToProcess = [];
        let totalPagesFromResponse = 1;

        if (Array.isArray(response.products)) {
          totalPagesFromResponse = response.totalPages;
          productsToProcess = response.products;
        } else {
          productsToProcess = [response];
        }

        totalPages = totalPagesFromResponse;

        // Process products with limited concurrency
        await asyncForEach(productsToProcess, async (syncedProduct) => {
          // Add a delay between requests
          await new Promise((resolve) => setTimeout(resolve, 3000));

          // Get WPS product data and compare it with the synced product data
          const puProduct = await executeWithRetry(() =>
            getPuProduct(syncedProduct.vendor_id, syncedProduct.create_value)
          );
          // put product name for same products with different variations
          puProduct.product_name = syncedProduct.product_name;

          const syncedProductData = await executeWithRetry(() =>
            getSyncedProduct(
              syncedProduct.vendor_id,
              syncedProduct.product_name
            )
          );
          // Check if an update is needed
          const isPriceUpdated = puProduct.price !== syncedProductData.price;
          const isInventoryUpdated = puProduct.variants.some((puVariant) => {
            // Find the corresponding synced variant using the vendor_id
            const syncedVariant = syncedProductData.variants.find(
              (v) => v.vendor_id === puVariant.id
            );

            // Check if the inventory_level has changed
            return (
              syncedVariant &&
              puVariant.inventory_level !== syncedVariant.inventory_level
            );
          });

          // If an update is needed, update the product and its variants
          if (isPriceUpdated || isInventoryUpdated) {
            try {
              // Update the product
              await executeWithRetry(() =>
                updateBigcommerceProduct(syncedProduct.bigcommerce_id, {
                  price: puProduct.price,
                })
              );

              // Loop through each variant in the synced product
              for (const syncedVariant of syncedProduct.variants) {
                // Find the corresponding WPS variant using the vendor_id
                const puVariant = puProduct.variants.find(
                  (v) => v.id === syncedVariant.vendor_id
                );
                // Check if the variant price or inventory_level has changed
                // const isPriceUpdated =
                //   puVariant.price !== syncedVariant.variant_price;
                // const isInventoryUpdated =
                //   puVariant.inventory_level !== syncedVariant.inventory_level;

                // if (isPriceUpdated || isInventoryUpdated) {
                //   // Update the product variant
                // }
                await executeWithRetry(() =>
                  updateBigcommerceProductVariants(
                    syncedProduct.bigcommerce_id,
                    [
                      {
                        id: syncedVariant.bigcommerce_id,
                        price: puVariant.price,
                        inventory_level: puVariant.inventory_level,
                      },
                    ]
                  )
                );
              }

              // Update the synced product status to 'Updated'
              puProduct.status = "Updated";
              await executeWithRetry(() => updateSyncedProduct(puProduct));
            } catch (error) {
              // If there's an error, update the synced product status to 'Error'
              puProduct.status = "Error";
              await executeWithRetry(() => updateSyncedProduct(puProduct));
            }
          } else {
            // If there's no change, update the synced product status to 'No changes'
            puProduct.status = "No changes";
            await executeWithRetry(() => updateSyncedProduct(puProduct));
          }
        });

        currentPage++;
      } catch (error) {
        console.error("Error updating products:", error);
        errors.push(error); // Push the error to the array and keep going
        currentPage++; // Increment the currentPage to continue to the next page
      }
    }

    if (errors.length > 0) {
      reject(errors); // If there were any errors, reject the promise with the errors
    } else {
      resolve(); // If no errors, resolve the promise
    }
  });
};

const router = express.Router();

router.get("/sync-status", async (req, res) => {
  res.send({ status: updateStatus });
});

router.get("/sync", async (req, res) => {
  const vendor_id = req.query.vendor_id;
  const name = req.query.name;
  const status = req.query.status;
  try {
    await updatePuProducts(vendor_id, name, status);
    res.send({ status: updateStatus });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { router as SyncPuProductsRouter };
