import BigCommerce from "node-bigcommerce";
import { Configuration } from "openai";
import axios from "axios";
import { config } from "dotenv";
config();

const clientId = process.env.BIGCOMMERCE_CLIENT_ID;
const accessToken = process.env.BIGCOMMERCE_ACCESS_TOKEN;
const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
const WPSToken = process.env.WPS_TOKEN;
const puAccessToken = process.env.PU_ACCESS_TOKEN;

const useHttps = process.env.USE_HTTPS === "true";

export const bigCommerceInstance = new BigCommerce({
  clientId: clientId,
  accessToken: accessToken,
  storeHash: storeHash,
  responseType: "json",
  callback: useHttps
    ? "https://localhost:3001/auth"
    : "http://localhost:3001/auth",
  headers: {
    "Accept-Encoding": "*",
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  apiVersion: "v3",
});

export const bigCommerceInstanceV2 = new BigCommerce({
  clientId: clientId,
  accessToken: accessToken,
  storeHash: storeHash,
  responseType: "json",
  callback: useHttps
    ? "https://localhost:3001/auth"
    : "http://localhost:3001/auth",
  headers: {
    "Accept-Encoding": "*",
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  apiVersion: "v2",
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

export const puDropshipInstance = axios.create({
  baseURL: "https://api.parts-unlimited.com/api/",
  headers: {
    "api-key": puAccessToken,
    "content-type": "application/json;charset=UTF-8",
  },
});

export const puInstance = axios.create({
  baseURL: "https://dealer.parts-unlimited.com/api/",
  timeout: 10000,
});

export const hhInstance = axios.create({
  baseURL: "https://zjyz2e2uav-dsn.algolia.net/1/indexes/",
  headers: {
    "X-Algolia-Api-Key": "359401d73db874c67e4b2eb5395b48a9",
    "X-Algolia-Application-Id": "ZJYZ2E2UAV",
    "content-type": "application/json",
  },
});

export const lsInstance = axios.create({
  baseURL: "https://www.wixapis.com/stores/v1/",
  headers: {
    Authorization:
      "PI48_2nfS5sMgxsb4F-LcguG7SJdN5_n2x7jNkBv7fc.eyJpbnN0YW5jZUlkIjoiMWY3OWVhMDYtODRiZi00NmU0LTk5MGItNDNkZjkzODBlNDI1IiwiYXBwRGVmSWQiOiIxMzgwYjcwMy1jZTgxLWZmMDUtZjExNS0zOTU3MWQ5NGRmY2QiLCJtZXRhU2l0ZUlkIjoiNDdkYzdlNzktMmFiMi00YzExLTkyMDktYjg3ODE1ZGY4MWNiIiwic2lnbkRhdGUiOiIyMDIzLTA4LTE0VDIxOjQ3OjMyLjY4MFoiLCJ2ZW5kb3JQcm9kdWN0SWQiOiJzdG9yZXNfc2lsdmVyIiwiZGVtb01vZGUiOmZhbHNlLCJvcmlnaW5JbnN0YW5jZUlkIjoiOWZiMWY2NDctYTY1ZC00MjIyLWE0ZjItZmNiZjNiYmYwYWRiIiwiYWlkIjoiMTk2ZDgxYzktMDU4YS00Njk3LWExNGUtOWI2ODM5NDA2ODMwIiwiYmlUb2tlbiI6IjU4YTU5NDdmLWFlMGQtMGFmNS0wYjAyLWZiYTc4NjVmNjVlZSIsInNpdGVPd25lcklkIjoiZTZmZGRhNzItZWNjNC00YmIzLWIyMGYtYzk1Y2I5Y2QxOGVlIn0",
    "content-type": "application/json",
  },
});
