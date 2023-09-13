import express from "express";
import { wpsInstance } from '../instances/index.js';

const router = express.Router();

router.get("/products/", async (req, res) => {
  let cursor = req.query.cursor ? req.query.cursor : "";
  let name = req.query.name ? req.query.name : "";
  await wpsInstance
    .get(`products/?include=items.inventory&filter[name][pre]=${name}&page[cursor]=${cursor}`)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.status(500).json({error: error.message});
    });
});

router.get("/items/", async (req, res) => {
  let cursor = req.query.cursor ? req.query.cursor : "";
  let keyword = req.query.keyword ? req.query.keyword : "";
  let searchby = req.query.searchby ? req.query.searchby : "name";
  await wpsInstance
    .get(`/items?include=inventory,images&filter[${searchby}][pre]=${keyword}&page[cursor]=${cursor}`)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({error: error.message});
    });
});

export { router as WPSProductsRouter };
