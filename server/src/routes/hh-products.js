import express from "express";
import { hhInstance } from "../instances/index.js";

const router = express.Router();

router.get("/products", async (req, res) => {
  let name = req.query.name ? req.query.name : "";
  let page = req.query.page ? req.query.page : 0;
  try {
    const response = await hhInstance.get(
      `/stage_products?query=${name}&page=${page}`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as hhProductsRouter };
