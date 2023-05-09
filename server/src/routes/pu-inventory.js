import express, { response } from "express";
import { puInventoryModel, puProductModel } from "../models/puInventory.js";
import { createNewDate } from "./../common/index.js";
import { puInstance } from "../instances/index.js";

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
    create_value,
  } = productData;
  const Inventory = await puInventoryModel.findOne({
    product_name,
  });

  if (Inventory) throw new Error("Product already exists!");

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

// new inventory

// export const addProduct = async (productData) => {
//   const {
//     vendor,
//     vendor_id,
//     bigcommerce_id,
//     sku,
//     original_name,
//     name,
//     price,
//     inventory_level,
//     last_updated,
//     status
//   } = productData;
//   const Inventory = await puProductModel.findOne({
//     sku,
//   });

//   if (Inventory) throw new Error("Product already exists!");

//   const newProduct = new puProductModel({
//     vendor,
//     vendor_id,
//     bigcommerce_id,
//     sku,
//     original_name,
//     name,
//     price,
//     inventory_level,
//     last_updated,
//     status
//   });
//   await newProduct.save();
//   return newProduct;
// };

router.get("/transfer", async (req, res) => {
  try {
    // const Inventory = await getInventoryProducts("", "", 1, 1);
    // for (const item of Inventory.products) {
    //   for (const variant of item.variants) {
    //     try {
    //       const productData = {
    //         vendor_id: variant.vendor_id,
    //         bigcommerce_id: variant.bigcommerce_id,
    //         sku: variant.vendor_id,
    //         price: variant.variant_price,
    //         inventory_level: variant.inventory_level,
    //         last_updated: item.last_updated,
    //         status: item.status,
    //       };

    //       const newProduct = new puProductModel(productData);
    //       await newProduct.save();
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    // }
    let search = "";
    let puVariationItemsResponse = "";
    let payload = {
      queryString: search,
      pagination: {
        limit: 50,
      },
    };
    puVariationItemsResponse = await puInstance.post(
      "parts/search/",
      payload
    );

    res.json({ m: puVariationItemsResponse.data });
  } catch (error) {
    res.json({ m: "Error during data transfer: " + error });
  }
});

export { router as puInventoryRouter };
