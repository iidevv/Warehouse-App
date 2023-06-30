import express from "express";
import axios from "axios";
import sharp from "sharp";
import fs from "fs";
import { promisify } from "util";
import { bigCommerceInstance } from "../instances/index.js";
import multer from "multer";

const router = express.Router();
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

const upload = multer();

router.get("/processing/:productId", async (req, res) => {
  try {
    const { data: product } = await bigCommerceInstance.get(`/catalog/products/${req.params.productId}`);
    const { data: images } = await bigCommerceInstance.get(`/catalog/products/${req.params.productId}/images`);
    
    if (!fs.existsSync('optimized')) {
      fs.mkdirSync('optimized');
    }

    const productName = product.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();

    // Оптимизируем изображения
    const optimizedImages = await Promise.all(images.map(async (image, index) => {
      const { data: buffer } = await axios.get(image.url_zoom, { responseType: 'arraybuffer' });

      const optimizedBuffer = await sharp(buffer)
        .resize(850) // Измените размер в соответствии с вашими потребностями
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .jpeg({ quality: 95 }) // Сжимаем изображение
        .toBuffer();

      const optimizedImagePath = `optimized/${productName}_${index}.jpg`;
      await writeFile(optimizedImagePath, optimizedBuffer);
      return optimizedImagePath;
    }));

    // Загружаем оптимизированные изображения на BigCommerce и обновляем данные товара
    for (let i = 0; i < optimizedImages.length; i++) {
      const imagePath = optimizedImages[i];
      const imageFile = fs.createReadStream(imagePath);
      await bigCommerceInstance.put(`/catalog/products/${req.params.productId}/images/${images[i].id}`, imageFile, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Удаляем оптимизированное изображение с сервера
      await unlink(imagePath);
    }

    res.status(200).json({ message: 'Images have been optimized and updated.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

export { router as imgProcessingRouter };
