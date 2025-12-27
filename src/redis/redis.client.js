import { createClient } from 'redis';
import envConfig from '../config/envConfig.js';


const redisClient = createClient({
  url: envConfig.REDIS_CLIENT_URL,
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

await redisClient.connect();

console.log("✅ Redis conectado");

export default redisClient;