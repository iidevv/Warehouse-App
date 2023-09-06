import mongoose from "mongoose";

const updateStatusSchema = new mongoose.Schema(
  {
    is_updating: { type: Boolean, required: true },
    update_status: { type: String, required: true },
  },
  { timestamps: true }
);

export const updateStatusModel = mongoose.model(
  "update-statuses",
  updateStatusSchema
);
