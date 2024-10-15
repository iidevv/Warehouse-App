import axios from "axios";
import { config } from "dotenv";
config();

const clientId = process.env.TURN_CLIENT_ID;
const accessToken = process.env.TURN_SECRET;

export const turnInstance = axios.create({
  baseURL: "https://api.turn14.com/v1/",
});

let token = null;

const getNewToken = async () => {
  const response = await axios.post("https://api.turn14.com/v1/token", {
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: accessToken,
  });

  token = response.data.access_token;

  return token;
};

turnInstance.interceptors.request.use(
  async (config) => {
    if (!token) {
      token = await getNewToken();
    }
    config.headers["Authorization"] = `Bearer ${token}`;
    console.log(config.headers["Authorization"]);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

turnInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      token = await getNewToken();

      originalRequest.headers["Authorization"] = `Bearer ${token}`;
      return turnInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);
