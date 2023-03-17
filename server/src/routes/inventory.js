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

router.get("/list", (req, res) => {
  bigCommerce
    .get("/catalog/products")
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post("/create", (req, res) => {
  // const product = req.body;
  const product = {
    name: "Thread Chasers",
    type: "physical",
    weight: 0.08,
    price: "4.99",
    description: "",
    brand_name: "BOLT",
    inventory_tracking: "variant",
    images: [
      { url: "https://cdn.wpsstatic.com/images/bc16-5d9651496f416.jpg" },
    ],
    variants: [
      {
        sku: "020-00010",
        price: "4.99",
        inventory_level: 39,
        option_values: [
          {
            label: "test",
            option_display_name: "tst",
          },
        ],
      },
    ],
  };
  console.log(product);
  bigCommerce
    .post("/catalog/products", product)
    .then((message) => {
      res.json(message);
      console.log(message);
    })
    .catch((err) => {
      res.json(err);
      console.log(err);
    });
});

export { router as inventoryRouter };
