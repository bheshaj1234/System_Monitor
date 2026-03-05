const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Error:", err.message);
});

const connectRedis = async () => {
  console.log("Connecting to Redis...");
  await redisClient.connect();
  console.log("✅ Redis Cloud Connected");
};

module.exports = { connectRedis, redisClient };