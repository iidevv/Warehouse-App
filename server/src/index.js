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
import { chatgptRouter } from "./routes/chatgpt.js";
import { CronJob } from "cron";
import { updateWpsProducts } from "./sync-products/index.js";
import cookieParser from "cookie-parser";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3001;
const dbname = process.env.DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const useHttps = process.env.USE_HTTPS === "true";
const app = express();
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(express.json());
app.use(
  cors({
    origin: useHttps ? "https://warehouse.discountmotogear.com" : "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/auth", userRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/inventory", SyncProductsRouter);
app.use("/api/gpt", chatgptRouter);
app.use("/api/products", bigcommerceRouter);
app.use("/api/wps", WPSProductsRouter);
app.use("/api/wps", WPSProductRouter);

mongoose.connect(
  `mongodb+srv://${dbUsername}:${dbPassword}@dmg.eqxtdze.mongodb.net/${dbname}?retryWrites=true&w=majority`
);

const job = new CronJob({
  cronTime: "0 7 * * *",
  onTick: () => {
    updateWpsProducts();
    console.log("Updating wps products...");
  },
  timeZone: "America/Los_Angeles",
  start: false,
});

if (useHttps) job.start();

app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);
