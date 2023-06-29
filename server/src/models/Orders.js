import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema({
  order_number: { type: Number, required: true },
});

export const OrdersModel = mongoose.model("dropship-log", ordersSchema);