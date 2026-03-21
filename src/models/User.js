const mongoose = require('mongoose');   

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpire: {
      type: Date
    },
    plan: {
    type: String,
    enum: ["FREE", "PRO"],
    default: "FREE"
  },
    isVerified:{
    type:Boolean,
    default:false
  },

  verificationToken:String
  
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;