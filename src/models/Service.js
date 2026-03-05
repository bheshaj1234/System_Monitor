const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  url: {
    type: String,
    required: true
  },

  interval: {
    type: Number,   // in seconds
    required: true,
    min: 10
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  },

  lastStatus: {
    type: String,
    enum: ["up", "down", "unknown"],
    default: "unknown"
  },

  lastCheckedAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);
