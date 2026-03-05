const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Service = require("../models/Service");
const MonitorLog = require("../models/MonitorLog");

router.get("/", auth, async (req, res, next) => {
  try {
    // 1️⃣ Get all services of logged-in user
    const services = await Service.find({ user: req.user.id });

    if (services.length === 0) {
      return res.json([]);
    }

    const serviceIds = services.map(s => s._id);

    // 2️⃣ Get all logs of these services
    const logs = await MonitorLog.find({
      service: { $in: serviceIds }
    }).sort({ checkedAt: -1 });

    // 3️⃣ Group logs by service
    const metrics = services.map(service => {
      const serviceLogs = logs.filter(
        log => log.service.toString() === service._id.toString()
      );

      if (serviceLogs.length === 0) {
        return {
          serviceId: service._id,
          serviceName: service.name,
          totalChecks: 0,
          uptimePercent: 0,
          averageResponseTime: 0,
          currentStatus: "UNKNOWN"
        };
      }

      const total = serviceLogs.length;
      const upCount = serviceLogs.filter(l => l.status === "UP").length;

      const uptime = ((upCount / total) * 100).toFixed(2);

      const avgResponse = (
        serviceLogs.reduce((acc, l) => acc + l.responseTime, 0) / total
      ).toFixed(2);

      const currentStatus = serviceLogs[0].status;

      return {
        serviceId: service._id,
        serviceName: service.name,
        totalChecks: total,
        uptimePercent: Number(uptime),
        averageResponseTime: Number(avgResponse),
        currentStatus
      };
    });

    res.json(metrics);

  } catch (err) {
    next(err);
  }
});

module.exports = router;