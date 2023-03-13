import express from "express";
import BigCommerce from "node-bigcommerce";
import { config } from "dotenv";
import axios from "axios";

config();

const router = express.Router();

const WPSToken = process.env.WPS_TOKEN;

const instance = axios.create({
  baseURL: "https://api.wps-inc.com/",
  headers: {
    "Authorization": `Bearer ${WPSToken}`,
  },
});

router.get("/products/", async (req, res) => {
  await instance
    .get("items")
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.status(500).json({error: error.message});
    });
});

export { router as WPSInventoryRouter };
