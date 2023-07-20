import express from "express";
import {
  getInventoryProducts,
  updateInventoryProduct,
} from "../routes/inventory.js";
import { bigCommerceInstance, wpsInstance } from "../instances/index.js";
import { sendNotification } from "../routes/tg-notifications.js";

// Define the IDs of the products to update
const getSyncedProducts = async (vendor_id, name, page, pageSize, status) => {
  return await getInventoryProducts(vendor_id, name, page, pageSize, status);
};
const getWPSProduct = async (id) => {
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
// Define the data to compare before update
const getSyncedProduct = async (vendor_id, name) => {
  return await getInventoryProducts(vendor_id, name, "", "");
};

// Define update product (id = bigcommerce product id, data = updated data)
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

// Define update productVariants (id = bigcommerce product id, data = updated data)
const updateBigcommerceProductVariants = async (id, variants) => {
  let message = "";

  for (let variant of variants) {
    try {
      await executeWithRetry(
        async () => {
          await bigCommerceInstance.put(
            `/catalog/products/${id}/variants/${variant.id}`,
            variant
          );
        },
        3,
        2000
      );
      // Add delay
      await new Promise((resolve) => setTimeout(resolve, 200)); // Delay of 1 second
    } catch (error) {
      console.log(`${variant.id} - error; (wps)`);
      message = "Error";
      sendNotification(`WPS Product: ${id}, variant: ${variant.id} (error BC)`);
    }
  }
  return message;
};

// Define update product, when sync completed (id = vendor id, data)
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
async function executeWithRetry(fn, maxRetries = 3, delay = 2000) {
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

export const updateWpsProducts = (vendor_id, name, status) => {
  return new Promise(async (resolve, reject) => {
    const pageSize = 5;
    let currentPage = 1;
    let totalPages = 1;
    let productsToUpdate = 0;
    let productsUpdated = 0;
    while (currentPage <= totalPages) {
      try {
        // Get synced products
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
        productsToUpdate += productsToProcess.length;

        totalPages = totalPagesFromResponse;

        // Process products with limited concurrency
        await asyncForEach(productsToProcess, async (syncedProduct) => {
          // Add a delay between requests
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Get WPS product data and compare it with the synced product data
          const wpsProduct = await executeWithRetry(() =>
            getWPSProduct(syncedProduct.vendor_id)
          );
          // put product name for same products with different variations
          wpsProduct.product_name = syncedProduct.product_name;

          const syncedProductData = await executeWithRetry(() =>
            getSyncedProduct(
              syncedProduct.vendor_id,
              syncedProduct.product_name
            )
          );

          // Check if an update is needed
          const isPriceUpdated = wpsProduct.price !== syncedProductData.price;
          const isInventoryUpdated = wpsProduct.variants.some((wpsVariant) => {
            // Find the corresponding synced variant using the vendor_id

            const syncedVariant = syncedProductData.variants.find(
              (v) => v.vendor_id == wpsVariant.id
            );
            // Check if the inventory_level has changed
            return (
              syncedVariant &&
              wpsVariant.inventory_level !== syncedVariant.inventory_level
            );
          });

          // If an update is needed, update the product and its variants
          if (isPriceUpdated || isInventoryUpdated) {
            try {
              // Update the product
              await executeWithRetry(() =>
                updateBigcommerceProduct(syncedProduct.bigcommerce_id, {
                  price: wpsProduct.price,
                })
              );
              // Loop through each variant in the synced product
              for (const syncedVariant of syncedProduct.variants) {
                // Find the corresponding WPS variant using the vendor_id
                const wpsVariant = wpsProduct.variants.find(
                  (v) => v.id == syncedVariant.vendor_id
                );

                // Check if the variant price or inventory_level has changed
                // const isPriceUpdated =
                //   wpsVariant.price !== syncedVariant.variant_price;
                // const isInventoryUpdated =
                //   wpsVariant.inventory_level !== syncedVariant.inventory_level;

                // if (isPriceUpdated || isInventoryUpdated) {
                // }
                const updatedVariants = await executeWithRetry(() => {
                  updateBigcommerceProductVariants(
                    syncedProduct.bigcommerce_id,
                    [
                      {
                        id: syncedVariant.bigcommerce_id,
                        price: wpsVariant.price || 0,
                        inventory_level: wpsVariant.inventory_level || 0,
                      },
                    ]
                  );
                  if (wpsVariant.inventory_level == undefined) {
                    sendNotification(
                      `WPS Product: ${syncedProduct.bigcommerce_id}, variant: ${wpsVariant.id} (inventory_level error)`
                    );
                  }
                  if (wpsVariant.price == undefined) {
                    sendNotification(
                      `WPS Product: ${syncedProduct.bigcommerce_id}, variant: ${wpsVariant.id} (price error)`
                    );
                  }
                });
              }

              // Update the synced product status to 'Updated'
              // if (updatedVariants == "Error") {
              //   wpsProduct.status = "Error";
              // } else {
              // }
              wpsProduct.status = "Updated";
              await updateSyncedProduct(wpsProduct);
            } catch (error) {
              // If there's an error, update the synced product status to 'Error'
              wpsProduct.status = "Error";
              await updateSyncedProduct(wpsProduct);
            }
          } else {
            // If there's no change, update the synced product status to 'No changes'
            wpsProduct.status = "No changes";
            await updateSyncedProduct(wpsProduct);
          }
          productsUpdated++;
        });

        currentPage++;
      } catch (error) {
        console.error("Error updating products:", error);
        break;
      }
    }
    sendNotification(
      `WPS products updated. ${productsUpdated}/${productsToUpdate}. Total pages: ${totalPages}`
    );
    resolve();
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
    await updateWpsProducts(vendor_id, name, status);
    res.send({ status: updateStatus });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { router as SyncProductsRouter };
