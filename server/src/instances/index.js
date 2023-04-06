import BigCommerce from "node-bigcommerce";
import { Configuration } from "openai";
import axios from "axios";
import { config } from "dotenv";
config();

const clientId = process.env.BIGCOMMERCE_CLIENT_ID;
const accessToken = process.env.BIGCOMMERCE_ACCESS_TOKEN;
const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
const WPSToken = process.env.WPS_TOKEN;

const useHttps = process.env.USE_HTTPS === "true";

export const bigCommerceInstance = new BigCommerce({
  clientId: clientId,
  accessToken: accessToken,
  storeHash: storeHash,
  responseType: "json",
  callback: useHttps
    ? "https://localhost:3001/auth"
    : "http://localhost:3001/auth",
  headers: { "Accept-Encoding": "*", "Content-Type": "application/json" },
  apiVersion: "v3",
});

export const gptInstance = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

export const wpsInstance = axios.create({
  baseURL: "https://api.wps-inc.com/",
  headers: {
    Authorization: `Bearer ${WPSToken}`,
  },
});