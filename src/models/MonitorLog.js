const mongoose = require("mongoose");

const monitorLogSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true
  },
  status:{
    type: String,
    enum: ['UP', 'DOWN'],
    required: true
  },    
  responseTime: Number,
  checkedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("MonitorLog", monitorLogSchema);