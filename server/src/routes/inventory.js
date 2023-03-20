import express from "express";
import { InventoryModel } from "../models/Inventory.js";
const router = express.Router();

// get
router.get("/products", async (req, res) => {
  const {
    vendor,
    vendor_id,
    bigcommerce_id,
    product_name,
    last_updated,
    status,
  } = req.body;
  const Inventory = await InventoryModel.find();
  const total = await InventoryModel.count();
  res.json({ products: Inventory, total: total });
});

// add
router.post("/products", async (req, res) => {
  const {
    vendor,
    vendor_id,
    bigcommerce_id,
    product_name,
    last_updated,
    status,
  } = req.body;
  const Inventory = await InventoryModel.findOne({
    product_name,
    bigcommerce_id,
    vendor_id,
  });
  if (Inventory) return res.json({ message: "Product already exists!" });

  const newProduct = new InventoryModel({
    vendor,
    vendor_id,
    bigcommerce_id,
    product_name,
    last_updated,
    status,
  });
  await newProduct.save();

  res.json(newProduct);
});

// update
router.put("/products", async (req, res) => {
  const {
    vendor,
    vendor_id,
    bigcommerce_id,
    product_name,
    last_updated,
    status,
  } = req.body;
  const Inventory = await InventoryModel.findOneAndUpdate(
    { product_name, bigcommerce_id, vendor_id },
    { vendor, vendor_id, bigcommerce_id, product_name, last_updated, status }
  );
  if (!Inventory) return res.json({ message: "Product doesn't exists!" });

  res.json({ message: `${product_name} Updated Successfully` });
});

// delete
router.delete("/products", async (req, res) => {
  const { bigcommerce_id } = req.body;
  const Inventory = await InventoryModel.findOneAndDelete({ bigcommerce_id });
  if (!Inventory) return res.json({ message: "Product doesn't exists!" });

  res.json({ message: 'Deleted Successfully' });
});

export { router as inventoryRouter };
