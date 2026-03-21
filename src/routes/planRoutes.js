const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const User = require("../models/User");
const Service = require("../models/Service");
const plans = require("../config/plans");

/////////////////////////////////////////////////////
// GET CURRENT PLAN INFO
/////////////////////////////////////////////////////

router.get("/me", auth, async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    const planConfig = plans[user.plan];

    const usedServices = await Service.countDocuments({
      user: req.user.id,
      isActive: true
    });

    res.json({
      plan: user.plan,
      serviceLimit: planConfig.serviceLimit,
      usedServices
    });

  } catch (err) {

    res.status(500).json({
      msg: "Failed to fetch plan info"
    });

  }

});

/////////////////////////////////////////////////////
// UPGRADE PLAN
/////////////////////////////////////////////////////

router.post("/upgrade", auth, async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    user.plan = "PRO";

    await user.save();

    res.json({
      msg: "Plan upgraded to PRO",
      plan: user.plan
    });

  } catch (err) {

    res.status(500).json({
      msg: "Upgrade failed"
    });

  }

});

/////////////////////////////////////////////////////
// DOWNGRADE PLAN (OPTIONAL)
/////////////////////////////////////////////////////

router.post("/downgrade", auth, async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    user.plan = "FREE";

    await user.save();

    res.json({
      msg: "Plan downgraded to FREE",
      plan: user.plan
    });

  } catch (err) {

    res.status(500).json({
      msg: "Downgrade failed"
    });

  }

});

module.exports = router;
