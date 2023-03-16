import express from "express";
import { config } from "dotenv";
import axios from "axios";

config();

const router = express.Router();

const WPSToken = process.env.WPS_TOKEN;

const instance = axios.create({
  baseURL: "https://api.wps-inc.com/",
  headers: {
    Authorization: `Bearer ${WPSToken}`,
  },
});

const fetchData = async (id) => {
  try {
    const [product, items] = await Promise.all([
      instance.get(`/products/${id}`).catch((error) => error),
      instance.get(`/products/${id}/items/`).catch((error) => error),
    ]);

    
    let itemsId = items.data.data.map((item) => item.id);
    itemsId = itemsId.toString();

    const [inventory, images] = await Promise.all([
      instance.get(`/inventory/${itemsId}`),
      instance.get(`/images/${itemsId}`),
    ]);

    const combinedData = {};

    combinedData.product = product.data;
    combinedData.items = items.data;
    combinedData.inventory = inventory.data;
    combinedData.images = images.data;

    return combinedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
};

router.get("/product/", async (req, res) => {
  let id = req.query.id;
  try {
    const combinedData = await fetchData(id);
    res.json(combinedData);
  } catch (error) {
    res.status(500).json({ error: "Error fetching combined data" });
  }
});

export { router as WPSProductRouter };
