const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const { connectRedis, redisClient } = require("./config/redis");

const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const metricsRoutes = require("./routes/metricRoutes");

const limiter = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");

const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const publicRoutes = require("./routes/publicRoutes");

const monitorServices = require("./monitoring/monitoring");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//////////////////////////////////////////////////////////
// 🔥 DATABASE + REDIS CONNECTION
//////////////////////////////////////////////////////////

connectDB();


//////////////////////////////////////////////////////////
// 🔥 MIDDLEWARES
//////////////////////////////////////////////////////////

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(limiter);

//////////////////////////////////////////////////////////
// 🔥 API DOCUMENTATION
//////////////////////////////////////////////////////////

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

//////////////////////////////////////////////////////////
// 🔥 ROUTES
//////////////////////////////////////////////////////////

app.use("/auth", authRoutes);
app.use("/service", serviceRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/metrics", metricsRoutes);
app.use("/public",publicRoutes);

//////////////////////////////////////////////////////////
// 🔥 HEALTH CHECK (Important for Deployment)
//////////////////////////////////////////////////////////

app.get("/health", async (req, res) => {
  try {
    const redisStatus = redisClient.isOpen ? "Connected" : "Disconnected";

    res.json({
      status: "OK",
      uptime: process.uptime(),
      mongodb:
        mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
      redis: redisStatus,
      memory: process.memoryUsage(),
      timestamp: new Date(),
    });
  } catch (err) {
    res.status(500).json({ status: "Error", error: err.message });
  }
});

app.get("/redis-test", async (req, res) => {
  await redisClient.set("hello", "world");
  const data = await redisClient.get("hello");
  res.json({ value: data });
});

//////////////////////////////////////////////////////////
// 🔥 CRON JOB (Monitoring Engine)
//////////////////////////////////////////////////////////

const job = cron.schedule("* * * * *", async () => {
  console.log("Running service monitoring task...");
  await monitorServices();
});

job.start();

//////////////////////////////////////////////////////////
// 🔥 GLOBAL ERROR HANDLER
//////////////////////////////////////////////////////////

app.use(errorHandler);

//////////////////////////////////////////////////////////
// 🔥 GRACEFUL SHUTDOWN (Very Important)
//////////////////////////////////////////////////////////

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");

  await mongoose.connection.close();
  if (redisClient.isOpen) {
    await redisClient.quit();
  }

  process.exit(0);
});


module.exports = app;