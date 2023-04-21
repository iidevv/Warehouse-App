import express from "express";
import { puInstance } from "../instances/index.js";

const router = express.Router();

router.get("/products", async (req, res) => {
  let name = req.query.name ? req.query.name : "";
  let offset = req.query.offset ? req.query.offset : 0;
  let payload = {
    queryString: name,
    pagination: {
      limit: 20,
      offset: offset,
    },
  };
  await puInstance
    .post("parts/search/", payload)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

export { router as puProductsRouter };
