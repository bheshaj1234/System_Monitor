const express = require("express");
const router = express.Router();
const MonitorLog = require("../models/MonitorLog");
const auth = require("../middleware/auth");

// GET last 24 hours history
router.get("/history/:serviceId", auth, async (req, res) => {

  try {

    const { serviceId } = req.params;

    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const logs = await MonitorLog.find({
      service: serviceId,
      checkedAt: { $gte: last24Hours }
    }).sort({ checkedAt: 1 });

    res.json(logs);

  } catch (err) {

    console.error("History fetch error:", err);

    res.status(500).json({
      message: "Failed to fetch history"
    });

  }

});

module.exports = router;