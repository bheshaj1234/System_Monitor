require("dotenv").config();

const http = require("http");
const app = require("./app");
const socket = require("./socket");
const config = require("./config/env");
const { connectRedis } = require("./config/redis");

async function startServer() {
  try {
    console.log("Connecting to Redis...");
    await connectRedis();   // ✅ wait until Redis connects

    console.log("RAW ENV PORT =", process.env.PORT);
    console.log("CONFIG PORT =", config.port);

    const server = http.createServer(app);

    socket.init(server);

    server.listen(config.port, () => {
      console.log(
        `Server running in ${config.nodeEnv} on port ${config.port}`
      );
    });

  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();