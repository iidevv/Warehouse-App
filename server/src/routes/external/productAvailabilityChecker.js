import express from "express";
import axios from "axios";
import { bigCommerceInstance } from "../../instances/index.js";
import { updateWpsProducts } from "../../sync-products/index.js";
import { updatePuProducts } from "../../sync-products/pu-index.js";
import { puInventoryModel } from "../../models/puInventory.js";
import { InventoryModel } from "../../models/Inventory.js";
import tgBot from "../tg-notifications.js";

const router = express.Router();

router.post("/availability/", async (req, res) => {
  const { data: cart } = await bigCommerceInstance.get(
    `/carts/${req.body.data.cartId}`
  );
  const cartItemIds = cart.line_items.physical_items;

  const updatePromises = cartItemIds.map(async (item) => {
    const vendor_id = item.sku;
    const name = item.name;
    const puProduct = await puInventoryModel.findOne({
      vendor_id,
      product_name: name,
    });
    if (puProduct) await updatePuProducts(vendor_id, name);

    const wpsProduct = await InventoryModel.findOne({
      vendor_id,
      product_name: name,
    });
    if (wpsProduct) await updateWpsProducts(vendor_id, name);
  });

  await Promise.all(updatePromises);
  //   tgBot.sendMessage(chatId, "Availability checked!");

  res.json({ message: "Operation completed" });
});

export { router as ProductAvailabilityRouter };
