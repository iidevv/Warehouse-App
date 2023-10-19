import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const turnMiddleLayerSchema = new mongoose.Schema({
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

turnMiddleLayerSchema.plugin(paginate);

export const turnMiddleLayerModel = mongoose.model(
  "turn-middle-layer",
  turnMiddleLayerSchema
);
