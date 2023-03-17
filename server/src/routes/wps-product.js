import express from "express";
import { config } from "dotenv";
import axios from "axios";

config();

const router = express.Router();

const WPSToken = process.env.WPS_TOKEN;

const instance = axios.create({
  baseURL: "https://api.wps-inc.com/",
  headers: {
    Authorization: `Bearer ${WPSToken}`,
  },
});

const createProduct = (obj) => {
  const data = obj.data;
  const variants = obj.data.items.data;

  const product = {
    name: data.name,
    type: 'physical',
    weight: variants[0].weight,
    price: variants[0].list_price,
    description: data.description || "",
    brand_name: variants[0].brand.data.name || "",
    inventory_tracking: "variant",
    // categories: [
    //   {
    //     id: null
    //   },
    // ],
    images: variants.map((item) => {
      const imageUrl = item.images.data.length
      ? `https://${item.images.data[0].domain}${item.images.data[0].path}${item.images.data[0].filename}`
      : null;
      return {
        url: imageUrl,
      }
    }),
    variants: variants.map((item) => {
      const option = item.name
      ? item.name.toLowerCase()
      : null;
      return {
        sku: item.sku,
        price: item.list_price,
        inventory_level: item.inventory.data.total,
        option_values: [
          {
            option_display_name: "Options",
            label: option,
          },
        ],
      }
    },
  )}
  return product
}

const fetchData = async (id) => {
  try {
    const wpsProduct = await instance.get(
      `/products/${id}/?include=items.images,items.inventory,items.brand`
    );
    return createProduct(wpsProduct.data);
  } catch (error) {
    console.log(error);
    return error;
  }
};

router.get("/product/", async (req, res) => {
  const id = req.query.id;
  try {
    const product = await fetchData(id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { router as WPSProductRouter };
