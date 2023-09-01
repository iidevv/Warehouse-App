import express from "express";
import { bigCommerceInstance } from "../instances/index.js";
import { createInventoryProduct } from "./inventory.js";

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
    let result = await createInventoryProduct(product, message, "Created");

    res.json({ message, result });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

router.delete("/delete", async (req, res) => {
  let productId = req.query.id;
  try {
    const result = await bigCommerceInstance.delete(
      `/catalog/products/${productId}`
    );
    res.json(result);
  } catch (error) {
    res.json(error);
  }
});

export { router as bigcommerceRouter };
