import express from "express";
import axios from "axios";
import sharp from "sharp";
import fs from "fs";
import { promisify } from "util";
import { bigCommerceInstance } from "../instances/index.js";
import { ProcessedProduct } from "../models/ImgProccessing.js";

const router = express.Router();
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

router.get("/processing/", async (req, res) => {
  const PAGE_SIZE = 10;
  const DELAY = 2000;
  const MAX_RETRIES = 3;

  async function processProduct(product) {
    const processedProduct = await ProcessedProduct.findOne({
      productId: product.id,
    });
    if (processedProduct) {
      console.log(`Product with ID ${product.id} has already been processed.`);
      return;
    }
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
    const newProcessedProduct = new ProcessedProduct({ productId: product.id });
    await newProcessedProduct.save();
  }

  async function processAllProducts() {
    let page = 1;
    while (true) {
      try {
        const { data: products, meta } = await bigCommerceInstance.get(
          `/catalog/products?limit=${PAGE_SIZE}&page=${page}`
        );

        for (const product of products) {
          await processProduct(product);
        }

        if (page >= meta.pagination.total_pages) break;
        page += 1;
        console.log(`Page: ${page}/${meta.pagination.total_pages}`);
        await new Promise((resolve) => setTimeout(resolve, DELAY));
      } catch (error) {
        console.error(error);
      }
    }
  }

  processAllProducts()
    .then(() =>
      console.log("Images for all products have been optimized and updated.")
    )
    .catch((error) => console.error(error));
});

export { router as imgProcessingRouter };
