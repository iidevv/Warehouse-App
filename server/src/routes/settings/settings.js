import express from "express";
import { getRebuildTurnStatus } from "../../sync/common.js";
import { rebuildTurnProducts } from "../../middleLayer/turnMiddleLayer.js";
import { uploadFile } from "../../common/uploadFile.js";
import { getSyncCatalogStatus, syncCatalog } from "../../sync/catalog.js";

const router = express.Router();

router.post("/turn/rebuild-products", async (req, res) => {
  try {
    rebuildTurnProducts();
    res.json({ message: "Rebuilding..." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/turn/rebuild-status", async (req, res) => {
  try {
    const { is_updating, update_status } = await getRebuildTurnStatus();

    res.send({ is_updating, update_status });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/ls/upload-catalog", uploadFile.single("catalog"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: "No file uploaded" });
  }
  res
    .status(200)
    .json({ status: "File uploaded successfully", file: req.file });
});

router.post("/amazon/upload-file", uploadFile.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: "No file uploaded" });
  }
  res
    .status(200)
    .json({ status: "File uploaded successfully", file: req.file });
});

router.post("/sync/catalog", async (req, res) => {
  try {
    syncCatalog();
    res.json({ message: "Syncing..." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/sync/status", async (req, res) => {
  try {
    const { is_updating, update_status } = await getSyncCatalogStatus();

    res.send({ is_updating, update_status });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export { router as settingsRouter };
