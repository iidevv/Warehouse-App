import express from "express";
import { getRebuildTurnStatus } from "../../sync/common.js";
import { rebuildTurnProducts } from "../../middleLayer/turnMiddleLayer.js";

const router = express.Router();

router.post("/turn/rebuild-products", async (req, res) => {
  try {
    rebuildTurnProducts();
    res.json({ message: "Rebuilding..." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/turn/rebuild-status", async (req, res) => {
  try {
    const { is_updating, update_status } = await getRebuildTurnStatus();

    res.send({ is_updating, update_status });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export { router as settingsRouter };
