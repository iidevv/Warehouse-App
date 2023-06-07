import express from "express";
import { InventoryModel } from "../models/Inventory.js";
import { puInventoryModel } from "../models/puInventory.js";

const router = express.Router();

const getDataWps = async () => {
  try {
    const noChangesTotal = await InventoryModel.countDocuments({
      status: "No changes",
    });
    const updatedTotal = await InventoryModel.countDocuments({
      status: "Updated",
    });
    const createdTotal = await InventoryModel.countDocuments({
      status: "Created",
    });
    const errorTotal = await InventoryModel.countDocuments({ status: "Error" });
    const total = await InventoryModel.count();
    return {
      noChangesTotal,
      updatedTotal,
      createdTotal,
      errorTotal,
      total,
    };
  } catch (error) {
    console.log(error);
    return {
      noChangesTotal: 0,
      updatedTotal: 0,
      createdTotal: 0,
      errorTotal: 0,
      total: 0,
    };
  }
};

const getDataPu = async () => {
  try {
    const noChangesTotal = await puInventoryModel.countDocuments({
      status: "No changes",
    });
    const updatedTotal = await puInventoryModel.countDocuments({
      status: "Updated",
    });
    const createdTotal = await puInventoryModel.countDocuments({
      status: "Created",
    });
    const errorTotal = await puInventoryModel.countDocuments({
      status: "Error",
    });
    const total = await puInventoryModel.count();
    return {
      noChangesTotal,
      updatedTotal,
      createdTotal,
      errorTotal,
      total,
    };
  } catch (error) {
    console.log(error);
    return {
      noChangesTotal: 0,
      updatedTotal: 0,
      createdTotal: 0,
      errorTotal: 0,
      total: 0,
    };
  }
};

router.get("/info", async (req, res) => {
  try {
    const wpsData = await getDataWps();
    const puData = await getDataPu();
    const data = {
      noChangesTotal: wpsData.noChangesTotal + puData.noChangesTotal,
      updatedTotal: wpsData.updatedTotal + puData.updatedTotal,
      createdTotal: wpsData.createdTotal + puData.createdTotal,
      errorTotal: wpsData.errorTotal + puData.errorTotal,
      total: wpsData.total + puData.total,
    };
    res.json({ data, wpsData, puData });
  } catch (error) {
    console.log(error);
  }
});

export { router as dashboardRouter };
