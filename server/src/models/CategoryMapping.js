import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const categoryMappingSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  url: { type: String },
  vendor_name: { type: String, required: true },
  vendor_id: { type: String, required: true, unique: true },
  vendor_url: { type: String, required: true, unique: true },
});

categoryMappingSchema.plugin(paginate);

export const PuCategoryMappingModel = mongoose.model(
  "pu-categories",
  categoryMappingSchema
);
