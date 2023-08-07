import express from "express";
import { sendNotification } from "../routes/tg-notifications.js";
import { downloadInventoryFile } from "./ftp.js";
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

export const updateProducts = (vendor, vendor_id, name, status) => {
  return new Promise(async (resolve, reject) => {
    const pageSize = 5;
    let currentPage = 1;
    let totalPages = 1;
    let productsToUpdate = 0;
    let productsUpdated = 0;

    if (vendor == "HH") {
      await downloadInventoryFile(vendor);
    }

    while (currentPage <= totalPages) {
      try {
        // Get synced products
        const response = await executeWithRetry(() =>
          getSyncedProducts(
            vendor,
            vendor_id,
            name,
            currentPage,
            pageSize,
            status
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
              vendor,
              syncedProduct.vendor_id,
              syncedProduct.product_name
            )
          );
          if (!product) {
            syncedProduct.status = "Error";
            await updateSyncedProduct(vendor, syncedProduct);
            return;
          }
          // put product name for same products with different variations
          product.product_name = syncedProduct.product_name;

          const syncedProductData = await executeWithRetry(() =>
            getSyncedProduct(
              vendor,
              syncedProduct.vendor_id,
              syncedProduct.product_name
            )
          );

          if (product.variants.length != syncedProductData.variants.length) {
            // sendNotification(
            //   `${product.product_name} variants length not match. ${product.variants.length}/${syncedProductData.variants.length}`
            // );
          }

          // Check if an update is needed
          const isPriceUpdated = syncedProductData.variants.some((variant) => {
            const syncedVariant = product.variants.find(
              (v) => v.id == variant.vendor_id
            );
            return (
              syncedVariant && variant.price !== syncedVariant.variant_price
            );
          });
          const isInventoryUpdated = syncedProductData.variants.some(
            (variant) => {
              const syncedVariant = product.variants.find(
                (v) => v.id == variant.vendor_id
              );
              return (
                syncedVariant &&
                variant.inventory_level !== syncedVariant.inventory_level
              );
            }
          );
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
                await executeWithRetry(() => {
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
                });
              }

              // Update the synced product status to 'Updated'
              // if (updatedVariants == "Error") {
              //   product.status = "Error";
              // } else {
              // }
              product.status = "Updated";
              await updateSyncedProduct(vendor, product);
            } catch (error) {
              // If there's an error, update the synced product status to 'Error'
              product.status = "Error";
              await updateSyncedProduct(vendor, product);
            }
          } else {
            // If there's no change, update the synced product status to 'No changes'
            product.status = "No changes";
            await updateSyncedProduct(vendor, product);
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
  try {
    await updateProducts(vendor, vendor_id, name, status);
    res.send({ status: updateStatus });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { router as SyncProductsRouter };
