import express from "express";
import { puInventoryModel } from "../models/puInventory.js";
import { createNewDate } from "./../common/index.js";
const router = express.Router();

// get
router.get("/products", async (req, res) => {
  const vendor_id = req.query.id;
  const name = "";
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  try {
    const products = await getInventoryProducts(
      vendor_id,
      name,
      page,
      pageSize
    );
    res.json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export const getInventoryProducts = async (vendor_id, name, page, pageSize) => {
  if ((vendor_id, name)) {
    const product = await puInventoryModel.findOne({
      vendor_id,
      product_name: name,
    });
    return product;
  } else {
    const total = await puInventoryModel.count();
    const totalPages = Math.ceil(total / pageSize);
    const skip = (page - 1) * pageSize;

    const Inventory = await puInventoryModel
      .find()
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
    create_type,
    create_value
  } = productData;
  const Inventory = await puInventoryModel.findOne({
    product_name,
  });

  if (Inventory) return res.json({ message: "Product already exists!" });

  const newProduct = new puInventoryModel({
    vendor,
    vendor_id,
    bigcommerce_id,
    price,
    variants,
    product_name,
    last_updated,
    status,
    create_type,
    create_value
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
      const product = await puInventoryModel.findOne({
        vendor_id: updatedProductData.id,
        product_name: updatedProductData.product_name,
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
  const Inventory = await puInventoryModel.findOneAndDelete({ bigcommerce_id });
  if (!Inventory) return res.json({ message: "Product doesn't exists!" });

  res.json({ message: "Deleted Successfully" });
});

export { router as puInventoryRouter };
