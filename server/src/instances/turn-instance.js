import axios from "axios";
import { config } from "dotenv";
config();

const clientId = process.env.TURN_CLIENT_ID;
const accessToken = process.env.TURN_SECRET;

export const turnInstance = axios.create({
  baseURL: "https://api.turn14.com/v1/",
});

const getNewToken = () => {
  turnInstance.post("/v1/token", {
    client_id: clientId,
    client_secret: accessToken,
    grant_type: "client_credentials",
  });
  
  console.log(response.data);
  return response.data.access_token;
};

turnInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const token = await getNewToken(); // Fetch new token
      originalRequest.headers["Authorization"] = "Bearer " + token;
      return turnInstance(originalRequest); // Retry the request with the new token
    }
    return Promise.reject(error);
  }
);
