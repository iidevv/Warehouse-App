import express from "express";
import { createInventoryProduct } from "../sync-products/inventory-manager.js";
import { bigCommerceInstance } from "../instances/index.js";

const router = express.Router();

router.get("/list", (req, res) => {
  bigCommerceInstance
    .get("/catalog/products")
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/categories", (req, res) => {
  const queryParams = new URLSearchParams(req.query);
  bigCommerceInstance
    .get(`/catalog/categories?${queryParams}`)
    .then((categories) => {
      res.json(categories);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post("/create", async (req, res) => {
  let product = req.body;
  try {
    const message = await bigCommerceInstance.post(
      "/catalog/products",
      product
    );
    const result = await createInventoryProduct(product, message, "Created");
    res.json({ message, result });
  } catch (error) {
    res.json(error);
  }
});

export { router as bigcommerceRouter };
