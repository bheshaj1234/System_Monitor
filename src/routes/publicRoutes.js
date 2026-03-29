const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const MonitorLog = require("../models/MonitorLog");

router.get("/status/:slug", async (req,res)=>{

 try{

 const service = await Service.findOne({ slug:req.params.slug });

 if(!service)
  return res.status(404).json({msg:"Service not found"});

 const logs = await MonitorLog.find({service:service._id})
 .sort({checkedAt:-1})
 .limit(20);

 const total = logs.length;
 const up = logs.filter(l=>l.status==="UP").length;

 const uptime = total===0?0:((up/total)*100).toFixed(2);

 res.json({
  name:service.name,
  url:service.url,
  status:service.lastStatus,
  lastChecked:service.lastCheckedAt,
  uptime:uptime+"%",
  logs
 });

 }catch(err){
  res.status(500).json({msg:"Server error"});
 }

});

module.exports = router;