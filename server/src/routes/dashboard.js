import express from "express";
import { InventoryModel } from "../models/Inventory.js";
import { puInventoryModel } from "../models/puInventory.js";
import { hhInventoryModel } from "../models/hhInventory.js";

const router = express.Router();

const getData = async (model) => {
  try {
    const noChangesTotal = await model.countDocuments({
      status: "No changes",
    });
    const updatedTotal = await model.countDocuments({
      status: "Updated",
    });
    const createdTotal = await model.countDocuments({
      status: "Created",
    });
    const errorTotal = await model.countDocuments({ status: "Error" });
    const total = await model.count();
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

const totalData = (data) => {
  const totalData = {
    noChangesTotal: 0,
    updatedTotal: 0,
    createdTotal: 0,
    errorTotal: 0,
    total: 0,
  };
  data.forEach((dataItem) => {
    totalData.noChangesTotal += dataItem.noChangesTotal;
    totalData.updatedTotal += dataItem.updatedTotal;
    totalData.createdTotal += dataItem.createdTotal;
    totalData.errorTotal += dataItem.errorTotal;
    totalData.total += dataItem.total;
  });
  return totalData;
};

router.get("/info", async (req, res) => {
  try {
    const wpsData = await getData(InventoryModel);
    const puData = await getData(puInventoryModel);
    const hhData = await getData(hhInventoryModel);
    const data = totalData([wpsData, puData, hhData]);
    res.json({ data, wpsData, puData, hhData });
  } catch (error) {
    console.log(error);
  }
});

export { router as dashboardRouter };
