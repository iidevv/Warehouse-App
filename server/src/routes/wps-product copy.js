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

    const combinedData = {};

    if (product instanceof Error || product.response === 404) {
      console.warn("Error fetching product:", product.message);
    } else {
      combinedData.product = product.data;
    }

    if (items instanceof Error || items.response === 404) {
      console.warn("Error fetching items:", items.message);
    } else {
      combinedData.items = items.data;
    }

    return combinedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
};

router.get("/product/", async (req, res) => {
  let id = req.query.id;
  // let id = 38250;
  try {
    const combinedData = await fetchData(id);
    res.json(combinedData);
  } catch (error) {
    res.status(500).json({ error: "Error fetching combined data" });
  }
});

export { router as WPSProductRouter };
