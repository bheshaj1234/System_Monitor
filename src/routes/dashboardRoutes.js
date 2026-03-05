const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Service = require("../models/Service");
const MonitorLog = require("../models/MonitorLog");
const User = require("../models/User");
const { redisClient } = require("../config/redis");
const plans = require("../config/plans");

router.get("/", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const planConfig = plans[user.plan];

    const cacheKey = `dashboard:${req.user.id}`;

    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("⚡ Dashboard served from Redis Cloud");
      return res.json(JSON.parse(cachedData));
    }

    console.log("🐢 Cache MISS - Fetching from MongoDB");

    const services = await Service.find({ user: req.user.id });

    if (services.length === 0) {
      const emptyResponse = {
        totalServices: 0,
        up: 0,
        down: 0,
        lastChecked: null
      };

      await redisClient.setEx(
        cacheKey,
        planConfig.cacheTTL,
        JSON.stringify(emptyResponse)
      );

      return res.json(emptyResponse);
    }

    const serviceIds = services.map(s => s._id);

    const logs = await MonitorLog.aggregate([
      { $match: { service: { $in: serviceIds } } },
      { $sort: { checkedAt: -1 } },
      {
        $group: {
          _id: "$service",
          status: { $first: "$status" },
          checkedAt: { $first: "$checkedAt" }
        }
      }
    ]);

    let up = 0;
    let down = 0;
    let lastChecked = null;

    logs.forEach(log => {
      if (log.status === "UP") up++;
      else if (log.status === "DOWN") down++;

      if (!lastChecked || log.checkedAt > lastChecked)
        lastChecked = log.checkedAt;
    });

    const responseData = {
      totalServices: services.length,
      up,
      down,
      lastChecked
    };

    await redisClient.setEx(
      cacheKey,
      planConfig.cacheTTL,
      JSON.stringify(responseData)
    );

    res.json(responseData);

  } catch (err) {
    next(err);
  }
});

module.exports = router;