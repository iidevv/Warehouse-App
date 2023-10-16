import express from "express";
import axios from "axios";
import { addItemsToDatabase } from "../../middleLayer/turnMiddleLayer.js";

const router = express.Router();

router.get("/test-action/", async (req, res) => {
  try {
    const response = await addItemsToDatabase();
    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

export { router as testActionRouter };
