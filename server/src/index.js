import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { bigcommerceRouter } from "./routes/bigcommerce.js";
import { WPSProductsRouter } from "./routes/wps-products.js";
import { WPSProductRouter } from "./routes/wps-product.js";
import { inventoryRouter } from "./routes/inventory.js";
import { SyncProductsRouter } from "./sync-products/index.js";
import { userRouter } from "./routes/user.js";

const port = process.env.PORT || 3001;
const dbname = process.env.DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', userRouter);
app.use("/inventory", inventoryRouter);
app.use("/inventory", SyncProductsRouter);
app.use("/products", bigcommerceRouter);
app.use("/wps", WPSProductsRouter);
app.use("/wps", WPSProductRouter);

mongoose.connect(
  `mongodb+srv://${dbUsername}:${dbPassword}@dmg.eqxtdze.mongodb.net/${dbname}?retryWrites=true&w=majority`
);

app.listen(port, () => console.log("Server started!"));
