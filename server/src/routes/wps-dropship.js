import express from "express";
import { wpsInstance } from "../instances/index.js";

const router = express.Router();

router.get("/orders/", async (req, res) => {
  const from = req.query.from;
  const to = req.query.to;
  const page = req.query.page;
  try {
    const orders = await wpsInstance.get(`/orders?from_date=${from}&to_date=${to}`);
    res.json(orders.data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { router as wpsDropshipRouter };
