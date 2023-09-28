import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import url from "url";
import path from "path";
import { bigcommerceRouter } from "./routes/bigcommerce.js";
import { inventoryRouter } from "./routes/inventory.js";
import { userRouter } from "./routes/user.js";
import { chatgptRouter } from "./routes/chatgpt.js";
import { authenticate } from "./routes/user.js";
import cookieParser from "cookie-parser";
import { puExternalProductRouter } from "./routes/external/pu-product.js";
import { externalDeleteProductRouter } from "./routes/external/delete-product.js";
import { puDropshipRouter } from "./routes/pu-dropship.js";
import { dropshipOrderRouter } from "./routes/dropship.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { wpsDropshipRouter } from "./routes/wps-dropship.js";
import { externalOptimizationRouter } from "./routes/external/imgs-optimization.js";
import { processingRouter } from "./routes/external/processing.js";
import { bulkActionRouter } from "./routes/external/bulk-actions.js";
import { testActionRouter } from "./routes/external/test-action.js";
import { catalogRouter } from "./routes/catalog/catalog.js";
import { productRouter } from "./routes/product/product.js";
import { SyncRouter } from "./sync/index.js";
import { productMappingRouter } from "./sync/product-mapping.js";

import "./cron/index.js";
import "./sync/common.js";
import { categoryMapRouter } from "./routes/category-mapping.js";
import { imagesOptimizationRouter } from "./routes/product/images-optimization.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3001;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbname = process.env.DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const useHttps = process.env.USE_HTTPS === "true";
const app = express();
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(express.json());

app.use("/external", puExternalProductRouter);
app.use("/external", externalOptimizationRouter);
app.use("/external", externalDeleteProductRouter);
app.use("/external", processingRouter);
app.use("/external", bulkActionRouter);
app.use("/external", testActionRouter);
app.use("/external", productMappingRouter);

app.use("/api/images", express.static(path.join(__dirname, "../optimized")));

app.use(
  cors({
    origin: useHttps
      ? "https://warehouse.discountmotogear.com"
      : "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/auth", userRouter);

app.use(authenticate);
app.use("/api/inventory", inventoryRouter);
app.use("/api/inventory", SyncRouter);
app.use("/api/category", categoryMapRouter);
app.use("/api/catalog", catalogRouter);
app.use("/api/catalog", productRouter);
app.use("/api/catalog", imagesOptimizationRouter);
app.use("/api/dropship", dropshipOrderRouter);
app.use("/api/pu-dropship", puDropshipRouter);
app.use("/api/wps-dropship", wpsDropshipRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/gpt", chatgptRouter);
app.use("/api/products", bigcommerceRouter);

mongoose.connect(
  `mongodb://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbname}?authMechanism=DEFAULT&authSource=${dbname}&ssl=true&sslValidate=false`
);

app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);
