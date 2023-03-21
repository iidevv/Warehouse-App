import express from "express";
import axios from "axios";
import { wpsInstance } from "../routes/wps-product.js";

const serverInstance = axios.create({
  baseURL: "http://localhost:3001",
});

const syncStockAndPrice = async () => {
  try {
    const inventoryProduct = await serverInstance.get(`/inventory/products`);
    return inventoryProduct;
    // const wpsProduct = await wpsInstance.get(
    //   `/products/${inventoryProduct.vendor_id}/?include=items.inventory`
    // );
  } catch (error) {}
};

const router = express.Router();

router.get("/sync", async (req, res) => {
  try {
    const inventoryProduct = await serverInstance
      .get(`/inventory/products`);
    res.json(inventoryProduct);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { router as SyncProductsRouter };
