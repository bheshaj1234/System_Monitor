const Service = require("../models/Service");
const plans = require("../config/plans");

module.exports = async function(req,res,next){

  try{

    const userId = req.user.id;

    const user = req.user;

    const userPlan = plans[user.plan] || plans.FREE;

    const serviceCount = await Service.countDocuments({
      user:userId
    });

    if(serviceCount >= userPlan.serviceLimit){

      return res.status(403).json({
        message:`${user.plan} plan limit reached. Upgrade to PRO`
      });

    }

    next();

  }catch(err){

    console.error(err);

    res.status(500).json({
      message:"Server error"
    });

  }

}
