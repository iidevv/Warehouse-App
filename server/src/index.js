import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import https from "https";
import fs from "fs";
import url from "url";
import path from "path";
import { bigcommerceRouter } from "./routes/bigcommerce.js";
import { WPSProductsRouter } from "./routes/wps-products.js";
import { WPSProductRouter } from "./routes/wps-product.js";
import { inventoryRouter } from "./routes/inventory.js";
import { SyncProductsRouter } from "./sync-products/index.js";
import { userRouter } from "./routes/user.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3001;
const dbname = process.env.DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const useHttps = process.env.USE_HTTPS === "true";
const app = express();

app.use(express.static(path.join(__dirname, "../client/build")));

app.use(express.json());
app.use(cors());

app.use("/api/auth", userRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/inventory", SyncProductsRouter);
app.use("/api/products", bigcommerceRouter);
app.use("/api/wps", WPSProductsRouter);
app.use("/api/wps", WPSProductRouter);

mongoose.connect(
  `mongodb+srv://${dbUsername}:${dbPassword}@dmg.eqxtdze.mongodb.net/${dbname}?retryWrites=true&w=majority`
);

app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);