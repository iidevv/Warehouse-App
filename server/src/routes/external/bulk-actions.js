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
  let currentPage = 33;
  let totalPages = 33;
  let totalVideos = 0;
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
      await asyncForEach(productsToProcess, async (syncedProduct) => {
        // Add a delay between requests
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const productId = syncedProduct.bigcommerce_id;
        console.log(productId);
        let youtubeIds = [];
        for (const syncedVariant of syncedProduct.variants) {
          const puProduct = await executeWithRetry(async () => {
            await new Promise((resolve) => setTimeout(resolve, 200));
            return await puInstance
              .get(`/parts/${syncedVariant.vendor_id}`)
              .catch((err) => console.log("Get vendor product error: ", err));
          });
          if (puProduct.data.product?.media) {
            for (let mediaItem of puProduct.data.product.media) {
              if (
                mediaItem.type === "video" &&
                mediaItem.source.name === "youtube"
              ) {
                youtubeIds.push(mediaItem.url);
              }
            }
          }
        }
        youtubeIds = [...new Set(youtubeIds)];
        await Promise.all(
          youtubeIds.map(async (youtubeId) => {
            const addVideo = await bigCommerceInstance
              .post(`/catalog/products/${productId}/videos`, {
                video_id: youtubeId,
              })
              .catch((err) =>
                console.log(`Product id: ${productId}. Error: ${err}`)
              );
            if (addVideo && addVideo.data) {
              totalVideos++;
            }
          })
        );
      });

      currentPage++;
      console.log(`Adding videos: ${currentPage}/${totalPages} (${totalVideos})`);
    } catch (error) {
      console.error("Error updating products:", error);
      break;
    }
  }
  console.log("Total Videos added: ", totalVideos);
  res.json({ status: "products updated." });
});

export { router as bulkActionRouter };
