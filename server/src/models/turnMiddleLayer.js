import mongoose from "mongoose";

const turnMiddleLayer = new mongoose.Schema({
  id: { type: String, unique: true },
  sku: { type: String, index: true },
  brand: String,
  name: { type: String, index: true },
  category: String,
  description: String,
  inventory_level: Number,
  price: Number,
  upc: String,
  images: Array,
  video: String,
  discontinued: { type: Boolean, default: false },
});

export const turnMiddleLayerModel = mongoose.model(
  "turn-middle-layer",
  turnMiddleLayer
);
