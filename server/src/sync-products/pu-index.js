import express from "express";
import { sendNotification } from "../routes/tg-notifications.js";
import { puSearchInstance } from "../instances/pu-search.js";
import {
  asyncForEach,
  executeWithRetry,
  getSyncedProduct,
  getSyncedProducts,
  updateBigcommerceProduct,
  updateBigcommerceProductVariants,
  updateSyncedProduct,
} from "./common.js";

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

    if (items.length != incorporatingPartNumbers.length) {
      sendNotification(
        `${name} variants length not match. ${items.length}/${incorporatingPartNumbers.length}`
      );
    }

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
      let inventoryLevel = item
        ? item.inventory.locales.reduce(
            (total, local) => total + (local.quantity || 0),
            0
          )
        : 0;
      if (data.access.notForSale || data.access.unavailableForPurchase) {
        inventoryLevel = 0;
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

let updateStatus = false;

export const updatePuProducts = (vendor_id, name, status) => {
  return new Promise(async (resolve, reject) => {
    const pageSize = 5;
    let currentPage = 1;
    let totalPages = 1;
    let productsToUpdate = 0;
    let productsUpdated = 0;
    let errors = []; // Add this to keep track of errors

    while (currentPage <= totalPages) {
      try {
        const response = await executeWithRetry(() =>
          getSyncedProducts(
            vendor_id,
            name,
            currentPage,
            pageSize,
            status,
            "PU"
          )
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
          await new Promise((resolve) => setTimeout(resolve, 3000));

          // Get WPS product data and compare it with the synced product data
          const puProduct = await executeWithRetry(() =>
            getPuProduct(syncedProduct.vendor_id, syncedProduct.product_name)
          );
          // put product name for same products with different variations
          puProduct.product_name = syncedProduct.product_name;

          const syncedProductData = await executeWithRetry(() =>
            getSyncedProduct(
              syncedProduct.vendor_id,
              syncedProduct.product_name,
              "PU"
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
                const updatedVariants = await executeWithRetry(() => {
                  updateBigcommerceProductVariants(
                    syncedProduct.bigcommerce_id,
                    [
                      {
                        id: syncedVariant.bigcommerce_id,
                        price: puVariant.price || 0,
                        inventory_level: puVariant.inventory_level || 0,
                      },
                    ]
                  );
                  if (puVariant.inventory_level == undefined) {
                    sendNotification(
                      `PU Product: ${syncedProduct.bigcommerce_id}, variant: ${puVariant.id} (inventory_level error)`
                    );
                  }
                  if (puVariant.price == undefined) {
                    sendNotification(
                      `PU Product: ${syncedProduct.bigcommerce_id}, variant: ${puVariant.id} (price error)`
                    );
                  }
                });
              }

              // Update the synced product status to 'Updated'
              // if (updatedVariants == "Error") {
              //   puProduct.status = "Error";
              // } else {
              // }
              puProduct.status = "Updated";
              await updateSyncedProduct(puProduct, "PU");
            } catch (error) {
              // If there's an error, update the synced product status to 'Error'
              puProduct.status = "Error";
              await updateSyncedProduct(puProduct, "PU");
            }
          } else {
            // If there's no change, update the synced product status to 'No changes'
            puProduct.status = "No changes";
            await updateSyncedProduct(puProduct, "PU");
          }
          productsUpdated++;
        });

        currentPage++;
      } catch (error) {
        console.error("Error updating products:", error);
        errors.push(error); // Push the error to the array and keep going
        currentPage++; // Increment the currentPage to continue to the next page
      }
    }
    sendNotification(
      `PU products updated. ${productsUpdated}/${productsToUpdate}. Total pages: ${totalPages}`
    );
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
