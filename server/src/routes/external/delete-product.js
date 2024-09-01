import express from "express";
import { getProductItemModel } from "../../common/index.js";
import { sendNotification } from "../tg-notifications.js";

const router = express.Router();

// vendor connection point

const findProduct = async (productId) => {
  const vendors = ["WPS", "PU", "HH", "LS", "TURN", "TORC"];

  for (const vendor of vendors) {
    try {
      const Model = getProductItemModel(vendor);
      const variants = await Model.find({ product_id: productId });

      if (variants.length) {
        return vendor;
      }
    } catch (error) {
      throw error;
    }
  }
  return false;
};

const deleteProduct = async (vendor, productId) => {
  const Model = getProductItemModel(vendor);
  try {
    await Model.deleteMany({ product_id: productId });
  } catch (error) {
    throw error;
  }
};

router.post("/delete-product/", async (req, res) => {
  const productId = req.body.data.id;

  if (!productId) return res.status(500).json({ error: "ID is not provided" });

  try {
    const vendor = await findProduct(productId);
    if (vendor) {
      await deleteProduct(vendor, productId);
      sendNotification(`Product ${productId} deleted`);
      res.json({ message: `Product ${productId} deleted` });
    } else {
      res.json({ message: `Product ${productId} not found!` });
    }
  } catch (error) {
    console.error(`Failed to process product ${productId}: `, error);
    res.status(500).json({ error: error.message });
  }
});

export { router as externalDeleteProductRouter };
