import express from "express";
import { InventoryModel } from "../models/Inventory.js";
import { createNewDate } from "./../common/index.js";
const router = express.Router();

// get
router.get("/products", async (req, res) => {
  const vendor_id = req.query.id;
  const page = parseInt(req.query.page) || 1; // default to page 1
  const pageSize = parseInt(req.query.pageSize) || 20; // default to 20 products per page

  if (vendor_id) {
    const product = await InventoryModel.findOne({ vendor_id });
    res.json(product);
  } else {
    const total = await InventoryModel.count();
    const totalPages = Math.ceil(total / pageSize);
    const skip = (page - 1) * pageSize;

    const Inventory = await InventoryModel.find()
      .sort({ last_updated: -1 })
      .skip(skip)
      .limit(pageSize);
    res.json({
      products: Inventory,
      total: total,
      totalPages: totalPages,
      currentPage: page,
    });
  }
});

// add
router.post("/products", async (req, res) => {
  const {
    vendor,
    vendor_id,
    bigcommerce_id,
    price,
    variants,
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
    price,
    variants,
    product_name,
    last_updated,
    status,
  });
  await newProduct.save();

  res.json(newProduct);
});

// update
router.put("/products", async (req, res) => {
  const updatedProductData = req.body;
  const findAndUpdateProduct = async (updatedProductData) => {
    try {
      const product = await InventoryModel.findOne({
        vendor_id: updatedProductData.id,
      });
      if (product) {
        if (product.price !== updatedProductData.price) {
          product.price = updatedProductData.price;
        }

        if (product.status !== updatedProductData.status) {
          product.status = updatedProductData.status;
        }

        for (const updatedVariant of updatedProductData.variants) {
          // Find the matching variant in the product
          const productVariantIndex = product.variants.findIndex(
            (variant) => variant.vendor_id === updatedVariant.id
          );

          if (productVariantIndex !== -1) {
            if (
              product.variants[productVariantIndex].variant_price !==
              updatedVariant.price
            ) {
              product.variants[productVariantIndex].variant_price =
                updatedVariant.price;
            }

            if (
              product.variants[productVariantIndex].inventory_level !==
              updatedVariant.inventory_level
            ) {
              product.variants[productVariantIndex].inventory_level =
                updatedVariant.inventory_level;
            }
          }
        }

        product.last_updated = createNewDate();
        await product.save();
        res.json({ Message: "updated!" });
      } else {
        res.json({ Error: "Product not found" });
        console.log("Product not found");
      }
    } catch (error) {
      res.json({ Error: err });
    }
  };

  findAndUpdateProduct(updatedProductData);
});

// delete
router.delete("/products", async (req, res) => {
  const vendor_id = req.query.id;
  const Inventory = await InventoryModel.findOneAndDelete({ vendor_id });
  if (!Inventory) return res.json({ message: "Product doesn't exists!" });

  res.json({ message: "Deleted Successfully" });
});

export { router as inventoryRouter };
