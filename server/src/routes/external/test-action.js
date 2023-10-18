import express from "express";
import axios from "axios";
import {
  addItemsDataToDatabase,
  addItemsInventoryToDatabase,
  addItemsPricesToDatabase,
  addItemsToDatabase,
} from "../../middleLayer/turnMiddleLayer.js";

const router = express.Router();

router.get("/test-action/", async (req, res) => {
  let page = req.query.page;
  try {
    const response = await addItemsPricesToDatabase(page);
    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/test-action-2/", async (req, res) => {
  let page = req.query.page;
  try {
    const response = await addItemsInventoryToDatabase(page);
    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

export { router as testActionRouter };
