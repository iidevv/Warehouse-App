import express from "express";
import { InventoryModel } from "../models/Inventory.js";
import { puInventoryModel } from "../models/puInventory.js";

const router = express.Router();

const getDataWps = async () => {
  try {
    const total = await InventoryModel.count();
    const created = await puInventoryModel.countDocuments(query);
    return {
      total: total,
    };
  } catch (error) {
    console.log(error);
  }
};

const getDataPu = async () => {};

router.get("/info", async (req, res) => {
  try {
    const wpsData = await getDataWps();
    // const puData = await getDataPu();
    // res.json({ wpsData, puData });
    res.json({ wpsData });
  } catch (error) {
    console.log(error);
  }
});

export { router as dashboardRouter };
