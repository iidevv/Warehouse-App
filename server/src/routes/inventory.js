import express from "express";
import { getProductItemModel } from "./../common/index.js";
const router = express.Router();

export const getInventoryProducts = async (vendor, page = 1, query = {}) => {
  const Model = getProductItemModel(vendor);

  const options = {
    page: page,
    limit: 20,
    lean: true,
    leanWithId: false,
  };

  const products = await Model.paginate(query, options);

  return {
    products: products.docs,
    total: products.totalDocs,
    page: products.page,
    nextPage: products.nextPage,
    prevPage: products.prevPage,
    totalPages: products.totalPages,
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
          product_name: product.data.name,
          sku: item.sku,
          inventory_level: item.inventory_level,
          price: item.price,
          sale_price: item.sale_price,
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
    product_name,
    sku,
    inventory_level,
    price,
    sale_price,
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
    product_name,
    sku,
    inventory_level,
    price,
    sale_price,
    update_status,
    update_log,
    discontinued,
  });
  await newProduct.save();

  return newProduct;
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
    const addedProduct = await addProductItem(vendor, req.body);
    res.json(addedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export { router as inventoryRouter };
