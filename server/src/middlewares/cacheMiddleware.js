import redis from "redis";
import { config } from "dotenv";

config();

// Создание клиента Redis
let client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

client.on("error", (err) => {
  console.error("Error connecting to Redis:", err.message);
});

client.on("end", () => {
  console.warn("Redis client disconnected. Reconnecting...");
  client.end(true);
  client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  });
});

const cacheMiddleware = (req, res, next) => {
  // Пропускаем кэширование для методов, отличных от GET
  if (req.method !== "GET") {
    return next();
  }

  // Проверяем, что клиент Redis подключен
  if (!client.connected) {
    console.warn("Redis client is not connected. Skipping caching.");
    return next();
  }

  const key = req.originalUrl;

  client.get(key, (err, data) => {
    if (err) {
      console.error("Error reading from Redis:", err.message);
      return next(err);
    }

    if (data) {
      return res.send(JSON.parse(data));
    } else {
      const sendResponse = res.send.bind(res);
      res.send = (body) => {
        client.setex(key, 600, JSON.stringify(body), (err) => {
          if (err) {
            console.error("Error writing to Redis:", err.message);
          }
        });
        sendResponse(body);
      };
      next();
    }
  });
};

export default cacheMiddleware;
