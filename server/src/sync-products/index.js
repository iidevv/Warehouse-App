import express from "express";
import { sendNotification } from "../routes/tg-notifications.js";
import {
  asyncForEach,
  executeWithRetry,
  getProduct,
  getSyncedProduct,
  getSyncedProducts,
  updateBigcommerceProduct,
  updateBigcommerceProductVariants,
  updateSyncedProduct,
} from "./common.js";

let updateStatus = false;

export const updateProducts = (vendor_id, name, status, vendor) => {
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
          getSyncedProducts(
            vendor_id,
            name,
            currentPage,
            pageSize,
            status,
            vendor
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
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Get product data and compare it with the synced product data
          const product = await executeWithRetry(() =>
            getProduct(
              syncedProduct.vendor_id,
              syncedProduct.product_name,
              vendor
            )
          );
          // put product name for same products with different variations
          product.product_name = syncedProduct.product_name;

          const syncedProductData = await executeWithRetry(() =>
            getSyncedProduct(
              syncedProduct.vendor_id,
              syncedProduct.product_name,
              vendor
            )
          );

          if (product.variants.length != syncedProductData.variants.length) {
            // sendNotification(
            //   `${product.product_name} variants length not match. ${product.variants.length}/${syncedProductData.variants.length}`
            // );
          }

          // Check if an update is needed
          const isPriceUpdated = product.price !== syncedProductData.price;
          const isInventoryUpdated = product.variants.some((variant) => {
            // Find the corresponding synced variant using the vendor_id

            const syncedVariant = syncedProductData.variants.find(
              (v) => v.vendor_id == variant.id
            );
            // Check if the inventory_level has changed
            return (
              syncedVariant &&
              variant.inventory_level !== syncedVariant.inventory_level
            );
          });

          // If an update is needed, update the product and its variants
          if (isPriceUpdated || isInventoryUpdated) {
            try {
              // Update the product
              await executeWithRetry(() =>
                updateBigcommerceProduct(syncedProduct.bigcommerce_id, {
                  price: product.price,
                })
              );
              // Loop through each variant in the synced product
              for (const syncedVariant of syncedProduct.variants) {
                // Find the corresponding variant using the vendor_id
                const variant = product.variants.find(
                  (v) => v.id == syncedVariant.vendor_id
                );

                // Check if the variant price or inventory_level has changed
                // const isPriceUpdated =
                //   variant.price !== syncedVariant.variant_price;
                // const isInventoryUpdated =
                //   variant.inventory_level !== syncedVariant.inventory_level;

                // if (isPriceUpdated || isInventoryUpdated) {
                // }
                const updatedVariants = await executeWithRetry(() => {
                  updateBigcommerceProductVariants(
                    syncedProduct.bigcommerce_id,
                    [
                      {
                        id: syncedVariant.bigcommerce_id,
                        price: variant.price || 0,
                        inventory_level: variant.inventory_level || 0,
                      },
                    ]
                  );
                  if (variant.inventory_level == undefined) {
                    sendNotification(
                      `${vendor} Product: ${syncedProduct.bigcommerce_id}, variant: ${variant.id} (inventory_level error)`
                    );
                  }
                  if (variant.price == undefined) {
                    sendNotification(
                      `${vendor} Product: ${syncedProduct.bigcommerce_id}, variant: ${variant.id} (price error)`
                    );
                  }
                });
              }

              // Update the synced product status to 'Updated'
              // if (updatedVariants == "Error") {
              //   product.status = "Error";
              // } else {
              // }
              product.status = "Updated";
              await updateSyncedProduct(product, vendor);
            } catch (error) {
              // If there's an error, update the synced product status to 'Error'
              product.status = "Error";
              await updateSyncedProduct(product, vendor);
            }
          } else {
            // If there's no change, update the synced product status to 'No changes'
            product.status = "No changes";
            await updateSyncedProduct(product, vendor);
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
      `${vendor} products updated. ${productsUpdated}/${productsToUpdate}. Total pages: ${totalPages}`
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
  const vendor = req.query.vendor;
  console.log(vendor);
  try {
    await updateProducts(vendor_id, name, status, vendor);
    res.send({ status: updateStatus });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { router as SyncProductsRouter };
