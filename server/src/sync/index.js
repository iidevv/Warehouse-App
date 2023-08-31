import express from "express";
import { sendNotification } from "../routes/tg-notifications.js";
import {
  afterUpdateProducts,
  beforeUpdateProducts,
  compareProducts,
  getSyncedProducts,
  getVendorProducts,
  updateProducts,
} from "./common.js";

const router = express.Router();

export const syncProducts = async (vendor, query, bulk = false) => {
  await beforeUpdateProducts(vendor, query);
  let processedProducts = 0;
  let page = 1;
  let hasNextPage = 1;
  while (hasNextPage) {
    try {
      const { syncedProducts, nextPage } = await getSyncedProducts(
        vendor,
        page,
        query
      );
      const vendorProducts = await getVendorProducts(vendor, syncedProducts);
      const productsForUpdate = await compareProducts(
        syncedProducts,
        vendorProducts,
        bulk
      );

      if (productsForUpdate.length > 0) {
        await updateProducts(vendor, productsForUpdate);
      }
      processedProducts += vendorProducts.length;
      hasNextPage = nextPage;
      page++;
    } catch (error) {
      console.error("Error updating products:", error);
      throw error;
    }
  }
  await afterUpdateProducts(vendor, query, processedProducts);
  return {
    updated: processedProducts,
  };
};

router.patch("/sync", async (req, res) => {
  const { vendor, query } = req.body;
  try {
    const response = await syncProducts(vendor, query);
    res.send(response);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/sync-status", async (req, res) => {
  res.send({ updating: false });
});

export { router as SyncRouter };
