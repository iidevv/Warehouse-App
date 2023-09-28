import express from "express";
import axios from "axios";
import sharp from "sharp";
import fs from "fs";
import { sendNotification } from "../tg-notifications.js";
const router = express.Router();

const processProduct = async (product) => {
  if (!fs.existsSync("optimized")) {
    fs.mkdirSync("optimized");
  }

  let optimizedImagePaths = {};

  for (let image of product.images) {
    const optimizedPath = await optimizeImage(image.image_url);
    optimizedImagePaths[image.image_url] = optimizedPath;
    image.image_url = `https://warehouse.discountmotogear.com/api/images/${optimizedPath}`;
  }

  for (let variant of product.variants) {
    if (optimizedImagePaths[variant.image_url]) {
      variant.image_url = `https://warehouse.discountmotogear.com/api/images/${
        optimizedImagePaths[variant.image_url]
      }`;
    } else {
      const optimizedPath = await optimizeImage(variant.image_url);
      optimizedImagePaths[variant.image_url] = optimizedPath;
      variant.image_url = `https://warehouse.discountmotogear.com/api/images/${optimizedPath}`;
    }
  }

  return product;
};

const optimizeImage = async (url) => {
  const originalFilename = path.basename(url).split("?")[0];
  const newFilename = `optimized_${originalFilename}`;

  try {
    const { data: buffer } = await axios.get(url, {
      responseType: "arraybuffer",
    });

    const optimizedBuffer = await sharp(buffer)
      .resize(1000, 1000, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255 },
      })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .jpeg({ quality: 90 })
      .toBuffer();

    await fs.promises.writeFile(`./optimized/${newFilename}`, optimizedBuffer);

    return newFilename;
  } catch (error) {
    console.error(`Error optimizing image: ${url}`, error);
    throw error;
  }
};

export const deleteOptimizedImages = () => {
  const prefix = "optimized";
  const files = fs.readdirSync("optimized");
  for (let file of files) {
    if (file.startsWith(prefix)) {
      try {
        fs.unlinkSync(path.join("optimized", file));
      } catch (err) {
        console.error(`Failed to delete file: ${file}`, err);
      }
    }
  }
};

router.put("/images-optimization/", async (req, res) => {
  const product = req.body;
  try {
    const response = processProduct(product);
    res.json(response);
  } catch (error) {
    sendNotification(`Failed to process product: ${error}`);
    res.status(500).json({ error: error });
  }
});

export { router as imagesOptimizationRouter };
