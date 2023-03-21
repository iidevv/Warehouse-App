import express from "express";
import axios from "axios";
import { serverInstance } from './inventory-manager.js';
import { wpsInstance } from '../routes/wps-product.js';

const createProduct = (obj) => {
  const data = obj.data;
  const variants = obj.data.items.data;

  const product = {
    price: data.list_price,
    variants: variants.map((item) => {
      return {
        id: item.id,
        price: item.list_price,
        inventory_level: item.inventory.data.total,
      };
    }),
  };
  return product;
};

const getWpsProduct = async (id) => {
  try {
    const inventoryProduct = await serverInstance.get(`/inventory/products?${id}`);
    const wpsProduct = await wpsInstance.get(
      `/products/${inventoryProduct.vendor_id}/?include=items.inventory`
    );
    return {
        currentProduct: inventoryProduct,
        vendorProduct: createProduct(wpsProduct.data)
    } 
  } catch (error) {
    return error;
  }
};

const router = express.Router();

router.get("/sync", async (req, res) => {
  const id = req.query.id;
  try {
    const products = await getWpsProduct(id);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});