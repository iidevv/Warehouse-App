import express from "express";
import axios from "axios";
import { bigCommerceInstance, puInstance } from "../../instances/index.js";
import { puInventoryModel } from "../../models/puInventory.js";

const router = express.Router();

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

router.get("/bulk-action/", async (req, res) => {
  const pageSize = 5;
  let currentPage = 1;
  let totalPages = 1;
  let totalUpcAdded = 0;
  while (currentPage <= totalPages) {
    try {
      // Get synced products
      const response = await executeWithRetry(async () => {
        const skip = (currentPage - 1) * pageSize;
        const total = await puInventoryModel.countDocuments();
        totalPages = Math.ceil(total / pageSize);
        return await puInventoryModel.find().skip(skip).limit(pageSize);
      });
      let productsToProcess = [];

      if (Array.isArray(response)) {
        productsToProcess = response;
      } else {
        console.error("Invalid response: products is not an array");
        break;
      }
      console.log(productsToProcess);
      await asyncForEach(productsToProcess, async (syncedProduct) => {
        // Add a delay between requests
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const productId = syncedProduct.bigcommerce_id;
        console.log(productId);
        for (const syncedVariant of syncedProduct.variants) {
          const puProduct = await executeWithRetry(async () => {
            return await puInstance
              .get(`/parts/${syncedVariant.vendor_id}`)
              .catch((err) => console.log("Get vendor product error: ", err));
          });
          const variantId = syncedVariant.bigcommerce_id;
          const upcCode = puProduct.data.upc;
          const gtinCode = puProduct.data.gtin;
          console.log(puProduct.data);
          if (upcCode) {
            await bigCommerceInstance
              .put(`/catalog/products/${productId}/variants/${variantId}`, {
                upc: upcCode,
                gtin: gtinCode || upcCode,
              })
              .then(() => {
                totalUpcAdded++;
              })
              .catch((err) =>
                console.log(
                  `Error updating product variant id: ${variantId}`,
                  err
                )
              );
          }
        }
      });

      currentPage++;
      console.log(`UPC Update ${currentPage}/${totalPages}`);
    } catch (error) {
      console.error("Error updating products:", error);
      break;
    }
  }
  console.log("Total UPC added: ", totalUpcAdded);
  res.json({ status: "WPS products updated." });
});

export { router as bulkActionRouter };
