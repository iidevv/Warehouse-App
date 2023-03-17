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

// product page
// https://api.wps-inc.com/products/1569/?include=items.images,items.inventory,items.brand
// big com
// https://developer.bigcommerce.com/docs/rest-management/catalog/products#create-a-product
// https://api.wps-inc.com/products/1569/?include=items.images
const productEx = {
  name: "My Product",
  type: "physical",
  description: "A description of my product",
  price: "10.99",
  weight: "1",
  categories: [
    {
      id: 1, // ID of the category the product belongs to
    },
  ],
  images: [
    {
      url: "https://example.com/image.jpg", // URL of the product image
    },
  ],
  variants: [
    {
      option_values: [
        {
          option_display_name: "Color",
          label: "Red",
        },
      ],
      sku: "PROD-123",
      price: "12.99",
      inventory_level: 10,
    },
    {
      option_values: [
        {
          option_display_name: "Color",
          label: "Blue",
        },
      ],
      sku: "PROD-124",
      price: "14.99",
      inventory_level: 5,
    },
  ],
};

const createProduct = (obj) => {
  const data = obj.data;
  const variants = obj.data.items.data;

  const product = {}
  product.name = data.name;
  product.type = "physical";
  product.description = data.description;
  product.price = variants[0].list_price;
  product.variants = [];
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
  // let id = req.query.id;
  let id = 1569;
  try {
    const product = await fetchData(id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { router as WPSProductRouter };
