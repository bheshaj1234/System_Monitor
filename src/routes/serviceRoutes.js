const express = require("express");
const router = express.Router();

const Service = require("../models/Service");
const User = require("../models/User");
const MonitorLog = require("../models/MonitorLog");

const auth = require("../middleware/auth");
const checkServiceOwnership = require("../middleware/checkServiceOwnership");
const planLimit = require("../middleware/planLimit");

const { redisClient } = require("../config/redis");

const slugify = require("slugify");

////////////////////////////////////////////////////////
// ADD SERVICE
////////////////////////////////////////////////////////

router.post("/add", auth, async (req, res) => {
  try {

    const { name, url, interval } = req.body;

    const user = await User.findById(req.user.id);

    const services = await Service.find({ user: req.user.id });

    const planLimits = {
      FREE: 5,
      PRO: 20
    };

    const limit = planLimits[user.plan] || 5;

    if (services.length >= limit) {
      return res.status(403).json({
        message: `${user.plan} plan limit reached`
      });
    }

    // ⭐ slug generate karo
    const slug =
    name.toLowerCase().replace(/\s+/g, "-") +
    "-" +
    Math.random().toString(36).substring(2, 6);

    const service = new Service({
      name,
      url,
      interval: Number(interval),
      slug,                 // ⭐ IMPORTANT
      user: req.user.id
    });

    await service.save();

    res.json(service);

  } catch (err) {

    console.error("Add Service Error:", err);

    res.status(500).json({
      message: err.message
    });

  }
});


////////////////////////////////////////////////////////
// GET MY SERVICES
////////////////////////////////////////////////////////

router.get("/my", auth, async (req, res) => {

  try {

    const services = await Service.find({
      user: req.user.id
    });

    res.json(services);

  } catch (err) {

    res.status(500).json({
      msg: "Failed to fetch services"
    });

  }

});

////////////////////////////////////////////////////////
// UPDATE SERVICE
////////////////////////////////////////////////////////

router.put("/update/:id", auth, async (req, res) => {

  try {

    const service = await Service.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      req.body,
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        msg: "Service not found"
      });
    }

if(redisClient){
      await redisClient.del(`dashboard:${req.user.id}`);
    }

    res.json(service);

  } catch (err) {

    res.status(500).json({
      msg: "Update failed"
    });

  }

});

////////////////////////////////////////////////////////
// DELETE SERVICE
////////////////////////////////////////////////////////

router.delete("/delete/:id", auth, checkServiceOwnership, async (req, res) => {

  try {

    const service = await Service.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!service) {
      return res.status(404).json({
        msg: "Service not found"
      });
    }

if(redisClient){
      await redisClient.del(`dashboard:${req.user.id}`);
    }

    res.json({
      msg: "Service deleted"
    });

  } catch (err) {

    res.status(500).json({
      msg: "Delete failed"
    });

  }

});

////////////////////////////////////////////////////////
// MANUAL SERVICE CHECK
////////////////////////////////////////////////////////

router.post("/:id/check", auth, checkServiceOwnership, async (req, res) => {

  try {

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        msg: "Service not found"
      });
    }

    ////////////////////////////////////////////////////////
    // UPDATE STATUS
    ////////////////////////////////////////////////////////

    service.lastStatus = "UP";
    service.lastCheckedAt = new Date();

    await service.save();

    ////////////////////////////////////////////////////////
    // SOCKET REALTIME UPDATE
    ////////////////////////////////////////////////////////

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
      service
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      msg: "Manual check failed"
    });

  }

});

////////////////////////////////////////////////////////
// PAUSE SERVICE
////////////////////////////////////////////////////////

router.put("/pause/:id", auth, checkServiceOwnership, async (req, res) => {

  try {

    const service = await Service.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      { isActive: false },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        msg: "Service not found"
      });
    }

if(redisClient){
      await redisClient.del(`dashboard:${req.user.id}`);
    }

    res.json({
      msg: "Service paused",
      service
    });

  } catch (err) {

    res.status(500).json({
      msg: "Pause failed"
    });

  }

});

////////////////////////////////////////////////////////
// RESUME SERVICE
////////////////////////////////////////////////////////

router.put("/resume/:id", auth, checkServiceOwnership, async (req, res) => {

  try {

    const service = await Service.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      { isActive: true },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        msg: "Service not found"
      });
    }

    if(redisClient){
      await redisClient.del(`dashboard:${req.user.id}`);
    }

    res.json({
      msg: "Service resumed",
      service
    });

  } catch (err) {

    res.status(500).json({
      msg: "Resume failed"
    });

  }

});

////////////////////////////////////////////////////////
// SERVICE HISTORY (PAGINATION)
////////////////////////////////////////////////////////

router.get("/history/:id", auth, checkServiceOwnership, async (req, res) => {

  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const logs = await MonitorLog.find({
      service: req.params.id
    })
      .sort({ checkedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await MonitorLog.countDocuments({
      service: req.params.id
    });

    res.json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalLogs: total,
      logs
    });

  } catch (err) {

    res.status(500).json({
      msg: "Failed to fetch history"
    });

  }

});

////////////////////////////////////////////////////////
// UPTIME PERCENTAGE
////////////////////////////////////////////////////////

router.get("/uptime/:id", auth, checkServiceOwnership, async (req, res) => {

  try {

    const logs = await MonitorLog.find({
      service: req.params.id
    });

    const total = logs.length;

    const upCount = logs.filter(log => log.status === "UP").length;

    const uptime = total === 0
      ? 0
      : ((upCount / total) * 100).toFixed(2);

    res.json({
      totalChecks: total,
      upChecks: upCount,
      uptimePercentage: `${uptime}%`
    });

  } catch (err) {

    res.status(500).json({
      msg: "Failed to calculate uptime"
    });

  }

});

module.exports = router;
