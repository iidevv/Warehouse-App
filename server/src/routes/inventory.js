import express from "express";
import { createNewDate, getInventoryModel } from "./../common/index.js";
const router = express.Router();

export const getInventoryProducts = async (
  vendor,
  vendor_id,
  name,
  page,
  pageSize,
  status,
  search,
  isUserRequest = false
) => {
  const Model = getInventoryModel(vendor);
  if ((vendor_id, name)) {
    const product = await Model.findOne({
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

    const total = await Model.countDocuments(query);
    const totalPages = Math.ceil(total / pageSize);
    const skip = (page - 1) * pageSize;

    const sort = isUserRequest ? { last_updated: -1 } : { inserted_at: 1 };

    const Inventory = await Model.find(query)
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

export const addInventoryProduct = async (vendor, productData) => {
  const Model = getInventoryModel(vendor);
  const {
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
  const Inventory = await Model.findOne({
    product_name,
  });

  if (Inventory) throw new Error("Product already exists!");

  const newProduct = new Model({
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

export const updateInventoryProduct = async (vendor, updatedProductData) => {
  const Model = getInventoryModel(vendor);
  try {
    const product = await Model.findOne({
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

// get
router.get("/products", async (req, res) => {
  const vendor = req.query.vendor;
  const vendor_id = req.query.id;
  const name = "";
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const status = req.query.status || "";
  const search = req.query.search || "";

  try {
    const products = await getInventoryProducts(
      vendor,
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

// add
router.post("/products", async (req, res) => {
  const vendor = req.query.vendor;
  try {
    const addedProduct = await addInventoryProduct(vendor, req.body);
    res.json(addedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// update
router.put("/products", async (req, res) => {
  const vendor = req.query.vendor;
  try {
    const response = await updateInventoryProduct(vendor, req.body);
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete
router.delete("/products", async (req, res) => {
  const Model = getInventoryModel(req.query.vendor);
  const bigcommerce_id = req.query.id;
  const Inventory = await Model.findOneAndDelete({ bigcommerce_id });
  if (!Inventory) return res.json({ message: "Product doesn't exists!" });

  res.json({ message: "Deleted Successfully" });
});

export { router as inventoryRouter };
