import express from "express";
import axios from "axios";
import sharp from "sharp";
import fs from "fs";
import { bigCommerceInstance } from "../../instances/index.js";

const router = express.Router();

async function processProduct(product) {
  const { data: images } = await bigCommerceInstance.get(
    `/catalog/products/${product.id}/images`
  );

  if (!fs.existsSync("optimized")) {
    fs.mkdirSync("optimized");
  }

  const productName = product.name
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .toLowerCase();

  // Оптимизируем изображения
  const optimizedImages = await Promise.all(
    images.map(async (image, index) => {
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          const { data: buffer } = await axios.get(image.url_zoom, {
            responseType: "arraybuffer",
          });

          const optimizedBuffer = await sharp(buffer)
            .resize(800)
            .flatten({ background: { r: 255, g: 255, b: 255 } })
            .jpeg({ quality: 90 })
            .toBuffer();

          const optimizedImagePath = `${productName}_${index}.jpg`;

          await fs.promises.writeFile(
            `./optimized/${optimizedImagePath}`,
            optimizedBuffer
          );
          return optimizedImagePath;
        } catch (error) {
          if (attempt === MAX_RETRIES - 1) throw error;
          console.error(`Error: ${index}, retrying...`, error);
          await new Promise((resolve) => setTimeout(resolve, DELAY));
        }
      }
    })
  );

  // Обновляем существующие изображения на BigCommerce
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const imagePath = optimizedImages[i];
    const imageUrl = `https://warehouse.discountmotogear.com/api/images/${imagePath}`;

    await bigCommerceInstance.put(
      `/catalog/products/${product.id}/images/${image.id}`,
      {
        image_url: imageUrl,
      }
    );
    setTimeout(() => {
      try {
        fs.unlinkSync(`./optimized/${imagePath}`);
      } catch (error) {
        console.error(`Failed to delete file: ${imagePath}`, error);
      }
    }, 2000);
  }
}

router.post("/optimization/", async (req, res) => {
  const productId = req.body.data.id;
  if(!productId) return res.status(500).json({ error: "ID is not provided" });

  const { data: product } = await bigCommerceInstance.get(
    `/catalog/products/${productId}`
  );

  if (!product.id) {
    console.log(`${productId} not found! (optimization)`);
    return;
  }
  try {
    await processProduct(product);
    res.json({ message: `${product.name} optimized` });
  } catch (error) {
    res.status(500).json({ error: error });
    console.error(`Failed to process product ${productId}: `, error);
  }
});

export { router as externalOptimizationRouter };
