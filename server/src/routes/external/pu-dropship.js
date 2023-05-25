import express from "express";
import { bigCommerceInstanceV2 } from "../../instances/index.js";

const router = express.Router();

router.post("/pu-order/", async (req, res) => {
  const orderId = req.body.data.id;
  console.log(orderId);
  try {
    const order = await bigCommerceInstanceV2.get(`/orders/${orderId}`);
    const orderItems = await bigCommerceInstanceV2.get(`/orders/${orderId}/products`);
    res.json({order: order, items: orderItems});
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { router as puExternalOrderRouter };
