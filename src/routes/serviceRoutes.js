const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const User = require("../models/User");
const auth = require("../middleware/auth");
const MonitorLog = require("../models/MonitorLog");
const checkServiceOwnership = require("../middleware/checkServiceOwnership");
const { redisClient } = require("../config/redis");
const plans = require("../config/plans");
const slugify = require("slugify");

// ===============================
// ADD SERVICE (Plan Based)
// ===============================

router.post("/add", auth, async (req, res) => {
  try {

    const { name, url, interval } = req.body;

    // Validate input
    if (!name || !url || !interval) {
      return res.status(400).json({ msg: "All fields required" });
    }

    // Get user plan
    const user = await User.findById(req.user.id);
    const planConfig = plans[user.plan];

    // Count active services
    const count = await Service.countDocuments({
      user: req.user.id,
      isActive: true
    });

    // Plan limit check
    if (count >= planConfig.serviceLimit) {
      return res.status(403).json({
        msg: `Your ${user.plan} plan allows only ${planConfig.serviceLimit} services`
      });
    }

    ////////////////////////////////////////////////////
    // SLUG GENERATION
    ////////////////////////////////////////////////////

    let slug = slugify(name, {
      lower: true,
      strict: true
    });

    // Check duplicate slug
    const existingSlug = await Service.findOne({ slug });

    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    ////////////////////////////////////////////////////
    // CREATE SERVICE
    ////////////////////////////////////////////////////

    const service = await Service.create({
      name,
      url,
      interval,
      slug,
      user: req.user.id
    });

    ////////////////////////////////////////////////////
    // CLEAR DASHBOARD CACHE
    ////////////////////////////////////////////////////

    await redisClient.del(`dashboard:${req.user.id}`);

    res.json(service);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

// ===============================
// GET MY SERVICES
// ===============================
router.get("/my", auth, async (req, res) => {
  const services = await Service.find({ user: req.user.id });
  res.json(services);
});

// ===============================
// UPDATE SERVICE
// ===============================
router.put("/update/:id", auth, async (req, res) => {
  const service = await Service.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );

  if (!service)
    return res.status(404).json({ msg: "Service not found" });

  await redisClient.del(`dashboard:${req.user.id}`);

  res.json(service);
});

// ===============================
// DELETE SERVICE
// ===============================
router.delete("/delete/:id", auth, checkServiceOwnership, async (req, res) => {
  const service = await Service.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id
  });

  if (!service)
    return res.status(404).json({ msg: "Service not found" });

  await redisClient.del(`dashboard:${req.user.id}`);

  res.json({ msg: "Service deleted" });
});

// ===============================
// MANUAL CHECK SERVICE (SOCKET ENABLED)
// ===============================
router.post("/:id/check", auth, checkServiceOwnership, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ msg: "Service not found" });
    }

    // 👉 Real monitoring logic yaha laga sakte ho
    service.lastStatus = "UP";   // Capital me rakho (uptime logic ke liye)
    service.lastCheckedAt = new Date();

    await service.save();

    // 🔥 SOCKET EMIT ADD KIYA
    const io = req.app.get("io");

    if (io) {
      io.emit("serviceStatusUpdate", {
        serviceId: service._id,
        status: service.lastStatus,
        checkedAt: service.lastCheckedAt
      });
    }

    res.json({
      msg: "Service checked successfully",
      service,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Manual check failed" });
  }
});

// ===============================
// PAUSE SERVICE
// ===============================
router.put("/pause/:id", auth, checkServiceOwnership, async (req, res) => {
  const service = await Service.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { isActive: false },
    { new: true }
  );

  if (!service)
    return res.status(404).json({ msg: "Service not found" });

  await redisClient.del(`dashboard:${req.user.id}`);

  res.json({ msg: "Service paused", service });
});

// ===============================
// RESUME SERVICE
// ===============================
router.put("/resume/:id", auth, checkServiceOwnership, async (req, res) => {
  const service = await Service.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { isActive: true },
    { new: true }
  );

  if (!service)
    return res.status(404).json({ msg: "Service not found" });

  await redisClient.del(`dashboard:${req.user.id}`);

  res.json({ msg: "Service resumed", service });
});

// ===============================
// HISTORY
// ===============================
router.get("/history/:id", auth, checkServiceOwnership, async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const logs = await MonitorLog.find({ service: req.params.id })
    .sort({ checkedAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await MonitorLog.countDocuments({ service: req.params.id });

  res.json({
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalLogs: total,
    logs
  });

});

// ===============================
// UPTIME PERCENTAGE
// ===============================
router.get("/uptime/:id", auth, checkServiceOwnership, async (req, res) => {

  const logs = await MonitorLog.find({ service: req.params.id });

  const total = logs.length;
  const upCount = logs.filter(log => log.status === "UP").length;

  const uptime = total === 0 ? 0 : ((upCount / total) * 100).toFixed(2);

  res.json({
    totalChecks: total,
    upChecks: upCount,
    uptimePercentage: `${uptime}%`
  });

});

module.exports = router;