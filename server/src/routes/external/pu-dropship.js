import express from "express";

const router = express.Router();

router.post("/pu-order/", async (req, res) => {
  const orderId = req.body.data.id;
  console.log(orderId);
  try {
    res.json({order_id: orderId});
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { router as puExternalOrderRouter };
