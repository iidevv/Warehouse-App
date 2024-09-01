import express from "express";
import { getWPSProduct } from "./vendors/wps.js";
import { getPUProduct } from "./vendors/pu.js";
import { getHHProduct } from "./vendors/hh.js";
import { getLSProduct } from "./vendors/ls.js";
import { getTURNProduct } from "./vendors/turn.js";
import { getTORCProduct } from "./vendors/torc.js";
const router = express.Router();

// vendor connection point

const getProduct = async (vendor, id, search, link) => {
  let response;
  switch (vendor) {
    case "WPS":
      response = await getWPSProduct(id);
      break;
    case "PU":
      response = await getPUProduct(id, search);
      break;
    case "HH":
      response = await getHHProduct(link);
      break;
    case "LS":
      response = await getLSProduct(id, search);
      break;
    case "TURN":
      response = await getTURNProduct(id, search);
      break;
    case "TORC":
      response = await getTORCProduct(id, search);
      break;
    default:
      response = { error: "Unsupported vendor." };
      break;
  }
  return response;
};

router.get("/product/", async (req, res) => {
  const { vendor, id, search, link } = req.query;
  try {
    const response = await getProduct(vendor, id, search, link);
    if (response.error) {
      res.status(400).json(response);
    } else {
      res.json(response);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as productRouter };
