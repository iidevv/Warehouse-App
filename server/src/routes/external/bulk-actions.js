import express from "express";
import axios from "axios";
import {
  bigCommerceInstance,
  wpsInstance,
  gptInstance,
} from "../../instances/index.js";
import { InventoryModel } from "../../models/Inventory.js";
import { OpenAIApi } from "openai";

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
  let totalVideos = 0;
  while (currentPage <= totalPages) {
    try {
      // Get synced products
      const response = await executeWithRetry(async () => {
        const skip = (currentPage - 1) * pageSize;
        const total = await InventoryModel.countDocuments();
        totalPages = Math.ceil(total / pageSize);
        return await InventoryModel.find().skip(skip).limit(pageSize);
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
        let youtubeId = "";
        const product = await executeWithRetry(async () => {
          await new Promise((resolve) => setTimeout(resolve, 400));
          return await wpsInstance
            .get(`/products/${syncedProduct.vendor_id}/resources`)
            .catch((err) => console.log("Get vendor product error: ", err));
        });
        youtubeId = product.data?.data[0]?.reference;
        let addVideo;
        if (youtubeId) {
          addVideo = await bigCommerceInstance
            .post(`/catalog/products/${productId}/videos`, {
              video_id: youtubeId,
            })
            .catch((err) =>
              console.log(`Product id: ${productId}. Error: ${err}`)
            );
        }
        console.log(`${productId} / ${youtubeId}`);
        if (addVideo && addVideo.data) {
          totalVideos++;
        }
      });

      currentPage++;
      console.log(
        `Adding videos: ${currentPage}/${totalPages} (${totalVideos})`
      );
    } catch (error) {
      console.error("Error updating products:", error);
      break;
    }
  }
  console.log("Total Videos added: ", totalVideos);
  res.json({ status: "products updated." });
});

const chatGpt = async (input) => {
  try {
    const openai = new OpenAIApi(gptInstance);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: input,
      max_tokens: 200,
      temperature: 0,
    });
    return response.data.choices[0].text;
  } catch (error) {
    console.log(error.message);
  }
};

router.get("/bulk-action-one/", async (req, res) => {
  try {
    const product = await bigCommerceInstance.get(`/catalog/products/5026`);
    const productDescription = product.data.description;
    const reviewRequest = {
      reviewsCount: Math.floor(Math.random() * 6) + 1,
      rules: [
        "don't put full title in review",
        "don't use same review length twice",
        "describe one or more features that you liked or disliked",
      ],
      responseExample: `response example:
      [{
        author: "Jimmy Doe",
        date_created: "",
        title: "Worked for me!",
        review: "I thought this product was pretty good",
        rating: 5,
        status: 1,
      }]`,
    };
    let gptText = `create ${
      reviewRequest.reviewsCount
    } reviews (Important: ${reviewRequest.rules.join(
      ", "
    )}) for ${productDescription}. ${reviewRequest.responseExample}`;
    console.log(gptText);
    const response = await chatGpt(gptText);

    res.json(response);
  } catch (error) {
    res.json({ error: error });
  }
});

export { router as bulkActionRouter };
