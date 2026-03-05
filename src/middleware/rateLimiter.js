const plans = require("../config/plans");
const { redisClient } = require("../config/redis");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    if (!req.user) return next();

    const user = await User.findById(req.user.id);
    const planConfig = plans[user.plan];

    const key = `rate:${req.user.id}`;

    const current = await redisClient.get(key);

    if (current && parseInt(current) >= planConfig.rateLimit) {
      return res.status(429).json({
        msg: "Rate limit exceeded"
      });
    }

    if (!current) {
      await redisClient.setEx(key, 3600, 1); // 1 hour window
    } else {
      await redisClient.incr(key);
    }

    next();

  } catch (err) {
    next(err);
  }
};



