import express from "express";
import { InventoryModel } from "../models/Inventory.js";
import { createNewDate } from "./../common/index.js";
const router = express.Router();

// get
router.get("/products", async (req, res) => {
  const vendor_id = req.query.id;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;

  try {
    const products = await getInventoryProducts(vendor_id, page, pageSize);
    res.json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export const getInventoryProducts = async (vendor_id, page, pageSize) => {
  if (vendor_id) {
    const product = await InventoryModel.findOne({ vendor_id });
    return product;
  } else {
    const total = await InventoryModel.count();
    const totalPages = Math.ceil(total / pageSize);
    const skip = (page - 1) * pageSize;

    const Inventory = await InventoryModel.find()
      .sort({ last_updated: -1 })
      .skip(skip)
      .limit(pageSize);
    return {
      products: Inventory,
      total: total,
      totalPages: totalPages,
      currentPage: page,
    };
  }
};

// add
router.post("/products", async (req, res) => {
  try {
    const addedProduct = await addInventoryProduct(req.body);
    res.json(addedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export const addInventoryProduct = async (productData) => {
  const {
    vendor,
    vendor_id,
    bigcommerce_id,
    price,
    variants,
    product_name,
    last_updated,
    status,
  } = productData;
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

  return newProduct;
};

// update
router.put("/products", async (req, res) => {
  try {
    const response = await updateInventoryProduct(req.body);
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export const updateInventoryProduct = async (updatedProductData) => {
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
        return { Message: "updated!" };
      } else {
        console.log("Product not found");
        return { Error: "Product not found" };
      }
    } catch (error) {
      return { Error: err };
    }
  };

  findAndUpdateProduct(updatedProductData);
};

// delete
router.delete("/products", async (req, res) => {
  const bigcommerce_id = req.query.id;
  const Inventory = await InventoryModel.findOneAndDelete({ bigcommerce_id });
  if (!Inventory) return res.json({ message: "Product doesn't exists!" });

  res.json({ message: "Deleted Successfully" });
});

export { router as inventoryRouter };
