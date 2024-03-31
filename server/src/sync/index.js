import express from "express";
import {
  afterUpdateProducts,
  beforeUpdateProducts,
  compareProducts,
  getSyncedProducts,
  getUpdateStatus,
  getVendorProducts,
  updateProducts,
} from "./common.js";
import { getRegExpFromString } from "../common/index.js";
import { updateProductItem } from "../routes/inventory.js";

const router = express.Router();

export const syncProducts = async (vendor, query, bulk = false) => {
  if (query?.sku) {
    query.sku = getRegExpFromString(query.sku);
    await updateProductItem(vendor, query.sku);
  }

  await beforeUpdateProducts(vendor, query);
  let processedProducts = 0;
  let page = 1;
  let hasNextPage = 1;
  while (hasNextPage) {
    try {
      const { syncedProducts, nextPage } = await getSyncedProducts(
        vendor,
        query,
        page
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
      throw { vendor, query, page, error };
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await afterUpdateProducts(vendor, query, processedProducts);
  return {
    updated: processedProducts,
  };
};

router.patch("/sync", async (req, res) => {
  const { vendor, query, bulk } = req.body;
  try {
    const response = await syncProducts(vendor, query, bulk);
    res.send(response);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/sync-status", async (req, res) => {
  try {
    const { is_updating, update_status } = await getUpdateStatus();
    res.send({ is_updating, update_status });
  } catch (error) {
    console.log(error);
  }
});

export { router as SyncRouter };
