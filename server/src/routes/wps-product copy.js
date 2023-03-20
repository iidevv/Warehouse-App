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

{
  "name": "Test Product",
  "type": "physical",
  "price": "19.99",
  "weight": 1.5,
  "variants": [
    {
      "sku": "TEST-PRODUCT-RED-SM",
      "option_values": [
        {
          "option_display_name": "Color",
          "label": "Red"
        },
        {
          "option_display_name": "Size",
          "label": "Small"
        }
      ],
      "price": "19.99",
      "inventory_level": 10,
      "image_url": "https://cdn.wpsstatic.com/images/430c-572a4ec101ed8.jpg",
      "is_default": true
    },
    {
      "sku": "TEST-PRODUCT-RED-MD",
      "option_values": [
        {
          "option_display_name": "Color",
          "label": "Red"
        },
        {
          "option_display_name": "Size",
          "label": "Medium"
        }
      ],
      "price": "19.99",
      "inventory_level": 5,
      "image_url": "https://cdn.wpsstatic.com/images/430c-572a4ec101ed8.jpg"
    },
    {
      "sku": "TEST-PRODUCT-BLUE-SM",
      "option_values": [
        {
          "option_display_name": "Color",
          "label": "Blue"
        },
        {
          "option_display_name": "Size",
          "label": "Small"
        }
      ],
      "price": "19.99",
      "inventory_level": 3,
      "image_url": "https://cdn.wpsstatic.com/images/430c-572a4ec101ed8.jpg"
    }
  ],
  "images": [
    {
      "is_thumbnail": true,
      "sort_order": 1,
      "image_url": "https://cdn.wpsstatic.com/images/430c-572a4ec101ed8.jpg"
    },
    {
      "is_thumbnail": false,
      "sort_order": 2,
      "image_url": "https://cdn.wpsstatic.com/images/430c-572a4ec101ed8.jpg"
    },
    {
      "is_thumbnail": false,
      "sort_order": 3,
      "image_url": "https://cdn.wpsstatic.com/images/430c-572a4ec101ed8.jpg"
    }
  ]
}

const fetchData = async (id) => {
  try {
    const [product, items] = await Promise.all([
      instance.get(`/products/${id}`).catch((error) => error),
      instance.get(`/products/${id}/items/`).catch((error) => error),
    ]);

    const combinedData = {};

    if (product instanceof Error || product.response === 404) {
      console.warn("Error fetching product:", product.message);
    } else {
      combinedData.product = product.data;
    }

    if (items instanceof Error || items.response === 404) {
      console.warn("Error fetching items:", items.message);
    } else {
      combinedData.items = items.data;
    }

    return combinedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
};

router.get("/product/", async (req, res) => {
  let id = req.query.id;
  // let id = 38250;
  try {
    const combinedData = await fetchData(id);
    res.json(combinedData);
  } catch (error) {
    res.status(500).json({ error: "Error fetching combined data" });
  }
});

export { router as WPSProductRouter };
