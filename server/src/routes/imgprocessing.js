import express from "express";
import axios from "axios";
import sharp from "sharp";
import fs from "fs";
import { promisify } from "util";
import { bigCommerceInstance } from "../instances/index.js";
import FormData from "form-data";

const router = express.Router();
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

router.get("/processing/:productId", async (req, res) => {
  try {
    const { data: product } = await bigCommerceInstance.get(
      `/catalog/products/${req.params.productId}`
    );
    const { data: images } = await bigCommerceInstance.get(
      `/catalog/products/${req.params.productId}/images`
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
        const { data: buffer } = await axios.get(image.url_zoom, {
          responseType: "arraybuffer",
        });

        const optimizedBuffer = await sharp(buffer)
          .resize(850) // Измените размер в соответствии с вашими потребностями
          .flatten({ background: { r: 255, g: 255, b: 255 } })
          .jpeg({ quality: 95 }) // Сжимаем изображение
          .toBuffer();

        const optimizedImagePath = `optimized/${productName}_${index}.jpg`;
        await writeFile(optimizedImagePath, optimizedBuffer);
        return optimizedImagePath;
      })
    );

    // Обновляем существующие изображения на BigCommerce
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imagePath = optimizedImages[i];
      const imageUrl = `https://warehouse.discountmotogear.com/api/images/${imagePath}`;

      const formData = new FormData();
      formData.append("image_file",imagePath);
      formData.append("image_url", imageUrl);
      formData.append("is_thumbnail", i === 0);
      formData.append("sort_order", i);

      await bigCommerceInstance.put(
        `/catalog/products/${req.params.productId}/images/${image.id}`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );

      // await unlink(imagePath);
    }

    res
      .status(200)
      .json({ message: "Images have been optimized and updated." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

export { router as imgProcessingRouter };
