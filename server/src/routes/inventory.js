import express from "express";
import {
  getInventoryStatus,
  getProductItemModel,
  getRegExpFromString,
} from "./../common/index.js";
const router = express.Router();

export const getInventoryProducts = async (vendor, query = {}, page = 1) => {
  const Model = getProductItemModel(vendor);

  if (query.sku) {
    query.sku = getRegExpFromString(query.sku);
  }

  const options = {
    page: page,
    limit: 20,
    lean: true,
    leanWithId: false,
    sort: { updatedAt: -1 },
  };

  const products = await Model.paginate(query, options);
  return {
    products: products.docs,
    pagination: {
      page: products.page,
      nextPage: products.nextPage,
      prevPage: products.prevPage,
      totalPages: products.totalPages,
    },
    total: products.totalDocs,
    query,
  };
};

export const createInventoryProduct = async (
  vendorProduct,
  product,
  status
) => {
  try {
    await Promise.all(
      product.data.variants.map(async (item) => {
        const data = {
          item_id: item.id,
          product_id: product.data.id,
          sku: item.sku,
          inventory_level: item.inventory_level,
          inventory_status: getInventoryStatus(item.inventory_level),
          price: item.price,
          update_status: status.toLowerCase(),
          update_log: "",
          discontinued: false,
        };
        await addProductItem(vendorProduct.vendor, data);
      })
    );

    return "Product synced!";
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addProductItem = async (vendor, data) => {
  const Model = getProductItemModel(vendor);
  const {
    item_id,
    product_id,
    sku,
    inventory_level,
    inventory_status,
    price,
    update_status,
    update_log,
    discontinued,
  } = data;
  const ProductItem = await Model.findOne({
    sku,
  });

  if (ProductItem) throw new Error(`${product_name} - ${sku}. Already exists!`);

  const newProduct = new Model({
    vendor,
    item_id,
    product_id,
    sku,
    inventory_level,
    inventory_status,
    price,
    update_status,
    update_log,
    discontinued,
  });
  await newProduct.save();

  return newProduct;
};

// get
router.get("/products", async (req, res) => {
  const { vendor, query, page } = req.query;

  try {
    const products = await getInventoryProducts(vendor, query, page);
    res.json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// add
router.post("/products", async (req, res) => {
  const vendor = req.query.vendor;
  try {
    const addedProduct = await addProductItem(vendor, req.body);
    res.json(addedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export { router as inventoryRouter };
