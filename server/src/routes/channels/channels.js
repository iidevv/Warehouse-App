import express from "express";
import { amazonItemModel } from "../../models/Channels.js";
import { getRegExpFromString } from "../../common/index.js";
import { refreshAmazonProducts, updateAmazonProducts } from "./amazon.js";
const router = express.Router();

const getChannelItemModel = (vendor) => {
  let model;
  switch (vendor) {
    case "AMAZON":
      model = amazonItemModel;
      break;

    default:
      break;
  }
  return model;
};

const updateProducts = async (vendor) => {
  switch (vendor) {
    case "AMAZON":
      await updateAmazonProducts();
      break;

    default:
      break;
  }
};

const refreshProducts = async (vendor) => {
  switch (vendor) {
    case "AMAZON":
      await refreshAmazonProducts();
      break;

    default:
      break;
  }
};

export const getChannelProducts = async (vendor, query = {}, page = 1) => {
  const Model = getChannelItemModel(vendor);

  if (query.sku) {
    query.sku = getRegExpFromString(query.sku);
  }

  const options = {
    page: page,
    limit: 20,
    lean: true,
    leanWithId: false,
    sort: { updatedAt: -1 },
  };

  const products = await Model.paginate(query, options);
  return {
    products: products.docs,
    pagination: {
      page: products.page,
      nextPage: products.nextPage,
      prevPage: products.prevPage,
      totalPages: products.totalPages,
    },
    total: products.totalDocs,
    query,
  };
};

router.post("/update", async (req, res) => {
  const { vendor } = req.body;
  try {
    // updateProducts(vendor);
    res.json({ message: `Updating ${vendor} products` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/refresh", async (req, res) => {
  const { vendor } = req.body;
  try {
    // refreshProducts(vendor);
    res.json({ message: `Refreshing ${vendor} products` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/products", async (req, res) => {
  const { vendor, query, page } = req.query;

  try {
    const products = await getChannelProducts(vendor, query, page);
    res.json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export { router as channelRouter };
