import express from "express";
import axios from "axios";
import {
  addItemsDataToDatabase,
  addItemsToDatabase,
} from "../../middleLayer/turnMiddleLayer.js";

const router = express.Router();

router.get("/test-action/", async (req, res) => {
  let page = req.query.page;
  try {
    // const response = await addItemsToDatabase();
    const response = await addItemsDataToDatabase(page);
    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

export { router as testActionRouter };
