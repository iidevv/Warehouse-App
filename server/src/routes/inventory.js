import express from "express";
import { InventoryModel } from "../models/Inventory.js";
import { createNewDate } from "./../common/index.js";
const router = express.Router();

// get
router.get("/products", async (req, res) => {
  const vendor_id = req.query.id;
  const name = "";
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const status = req.query.status || "";
  const search = req.query.search || "";

  try {
    const products = await getInventoryProducts(
      vendor_id,
      name,
      page,
      pageSize,
      status,
      search,
      true
    );
    res.json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export const getInventoryProducts = async (
  vendor_id,
  name,
  page,
  pageSize,
  status,
  search,
  isUserRequest = false
) => {
  if ((vendor_id, name)) {
    const product = await InventoryModel.findOne({
      vendor_id,
      product_name: name,
    });
    return product;
  } else {
    let query = {};
    if (status) {
      query.status = status;
    }
    if (search) {
      query.product_name = { $regex: search, $options: "i" };
    }

    const total = await InventoryModel.countDocuments(query);
    const totalPages = Math.ceil(total / pageSize);
    const skip = (page - 1) * pageSize;

    const sort = isUserRequest ? { last_updated: -1 } : { inserted_at: 1 };

    const Inventory = await InventoryModel.find(query)
      .sort(sort)
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
    create_type = "sku",
    create_value = "",
  } = productData;
  const Inventory = await InventoryModel.findOne({
    product_name,
  });

  if (Inventory) throw new Error("Product already exists!");

  const newProduct = new InventoryModel({
    vendor,
    vendor_id,
    bigcommerce_id,
    price,
    variants,
    product_name,
    last_updated,
    status,
    create_type,
    create_value,
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
            (variant) => variant.vendor_id == updatedVariant.id
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
        console.log(`Product not found: ${updatedProductData.product_name}`);
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
