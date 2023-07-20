import express from "express";
import axios from "axios";
import { puSearchInstance } from '../../instances/pu-search.js';

const router = express.Router();

router.get("/test-action/", async (req, res) => {
  let payload = {
    queryString: "ICON",
    pagination: {
      limit: 50,
    },
  };
  try {
    const response = await puSearchInstance(payload);
    res.json(response.data.result.hits);
  } catch (error) {
    res.status(500).json(error);
  }
});

export { router as testActionRouter };
