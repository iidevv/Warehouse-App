import express from "express";
import { sendNotification } from "../routes/tg-notifications.js";
import {
  beforeUpdateProducts,
  compareProducts,
  getSyncedProducts,
  getVendorProducts,
  updateProducts,
} from "./common.js";

const router = express.Router();

export const syncProducts = async (vendor, query, bulk = false) => {
  await beforeUpdateProducts(vendor);
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
      processedProducts += vendorProducts.length;
      const productsForUpdate = await compareProducts(
        syncedProducts,
        vendorProducts,
        bulk
      );
      console.log(productsForUpdate);
      console.log(productsForUpdate.length);
      if (productsForUpdate.length > 0) {
        await updateProducts(vendor, productsForUpdate);
      }
      break;
      hasNextPage = nextPage;
      page++;
    } catch (error) {
      console.error("Error updating products:", error);
      throw error;
    }
  }
  sendNotification(`${vendor} products updated. ${processedProducts}`);
};

router.patch("/sync-1", async (req, res) => {
  const { vendor, query } = req.body;
  try {
    const response = await syncProducts(vendor, query);
    res.send(response);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { router as SyncRouter };
