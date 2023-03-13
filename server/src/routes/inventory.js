import express from "express";
import BigCommerce from "node-bigcommerce";
import { config } from "dotenv";

config();

const router = express.Router();

const clientId = process.env.BIGCOMMERCE_CLIENT_ID;
const accessToken = process.env.BIGCOMMERCE_ACCESS_TOKEN;
const storeHash = process.env.BIGCOMMERCE_STORE_HASH;


const bigCommerce = new BigCommerce({
  clientId: clientId,
  accessToken: accessToken,
  storeHash: storeHash,
  responseType: "json",
  callback: "https://localhost:3001/auth",
  headers: { "Accept-Encoding": "*" },
  apiVersion: "v3",
});


router.get('/list', (req, res) => {
    bigCommerce
      .get("/catalog/products")
      .then((products) => {
        res.json(products);
      })
      .catch((err) => {
        res.json(err);
      });
  });

export {router as inventoryRouter};