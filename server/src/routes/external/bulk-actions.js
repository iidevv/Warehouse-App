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

const randomDate = () => {
  const start = "2022-01-01T00:00:00Z";
  const end = "2023-06-30T23:59:59Z";
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  const randomTime = Math.random() * (endDate - startDate) + startDate;
  const randomDate = new Date(randomTime);
  return randomDate.toISOString();
};

const createReviews = async (input) => {
  try {
    const openai = new OpenAIApi(gptInstance);
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: input }],
    });
    const reviews = JSON.parse(response.data.choices[0].message?.content);
    if (Array.isArray(reviews)) {
      return reviews;
    } else {
      console.log(`Is Not Array: ${reviews}`);
      return false;
    }
  } catch (error) {
    console.log(error.message);
  }
};

const setReviewText = (productDescription) => {
  const reviewRequest = {
    reviewsCount: Math.floor(Math.random() * 5) + 1,
    rules: [
      "Use only part of product name in the review (example: helmet, jersey)",
      "The title of the review should be unique",
      "Avoid using identical or repetitive phrases or sentence structures",
      "Ensure that author names do not repeat and do not contain identical initials",
      "Although the rating can range from 3 to 5 (whole number)",
      "The length of reviews should vary widely(short, medium, long)",
      "Each review should mention at least one feature of the product that the reviewer liked or disliked",
    ],
    responseExample: `response example (json):
    [{"name":"Adnan R","title":"Worked for me","text":"I thought this product was pretty good","rating":5},{"name":"Adnan R","title":"Worked for me!","text":"I thought this product was pretty good","rating":5}]`,
  };
  return `create ${
    reviewRequest.reviewsCount
  } reviews (Important: ${reviewRequest.rules.join(
    ", "
  )}) for ${productDescription}. ${reviewRequest.responseExample}`;
};

router.get("/bulk-action-one/", async (req, res) => {
  const productId = req.query.id;
  try {
    const product = await bigCommerceInstance.get(
      `/catalog/products/${productId}`
    );
    const productDescription = product.data.description;
    const reviewsText = setReviewText(productDescription);
    const reviews = await createReviews(reviewsText);
    console.log(reviews);
    await Promise.all(
      reviews.map(async (review) => {
        review.date_reviewed = randomDate();
        review.text = review.text.replace(/'/g, " ").replace(/&/g, "and").replace(/;/g, ".");
        review.status = "approved";
        await bigCommerceInstance
          .post(`/catalog/products/${productId}/reviews`, review)
          .catch((err) => console.log(err));
      })
    );

    res.json({ status: `ID: ${productId}. Reviews created.` });
  } catch (error) {
    res.json({ error: error });
  }
});

export { router as bulkActionRouter };
