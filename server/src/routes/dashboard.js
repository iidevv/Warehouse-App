import express from "express";
import {
  lsProductItemModel,
  hhProductItemModel,
  wpsProductItemModel,
  puProductItemModel,
  turnProductItemModel,
} from "../models/Inventory.js";

const router = express.Router();

const getData = async (model) => {
  try {
    const noChangesTotal = await model.countDocuments({
      update_status: "no changes",
    });
    const updatedTotal = await model.countDocuments({
      update_status: "updated",
    });
    const createdTotal = await model.countDocuments({
      update_status: "created",
    });
    const errorTotal = await model.countDocuments({ update_status: "error" });
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

// vendor connection point

router.get("/info", async (req, res) => {
  try {
    const wpsData = await getData(wpsProductItemModel);
    const puData = await getData(puProductItemModel);
    const hhData = await getData(hhProductItemModel);
    const lsData = await getData(lsProductItemModel);
    const turnData = await getData(turnProductItemModel);
    const data = totalData([wpsData, puData, hhData, lsData]);
    res.json({ data, wpsData, puData, hhData, lsData, turnData });
  } catch (error) {
    console.log(error);
  }
});

export { router as dashboardRouter };
