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
    plan: {
    type: String,
    enum: ["FREE", "PRO"],
    default: "FREE"
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;