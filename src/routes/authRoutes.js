const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const notifier = require("../notifications/notifier");
const crypto = require("crypto");

// REGISTER
router.post("/register", async (req, res, next) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    // 🔹 verification token generate
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      email,
      password: hash,
      verificationToken,
      isVerified: false
    });

    // 🔹 send verification email
    await notifier.sendVerificationEmail(email, verificationToken);

    // generate token (existing feature untouched)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Registered successfully. Please verify your email.",
      token,
      user: {
        id: user._id,
        email: user.email,
        plan: user.plan
      }
    });

  } catch (err) {
    next(err);
  }
});


// LOGIN
router.post("/login", async (req, res, next) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    // 🔹 check email verification
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in"
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (err) {
    next(err);
  }
});


// EMAIL VERIFICATION
router.get("/verify-email/:token", async (req, res) => {

  try {

    const user = await User.findOne({
      verificationToken: req.params.token
    });

    if (!user) {
      return res.status(400).send("Invalid or expired verification token");
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    res.send("Email verified successfully. You can now login.");

  } catch (error) {
    res.status(500).send("Verification failed");
  }

});

// Forgot Password
router.post("/forgot-password", async (req,res)=>{

  const { email } = req.body;

  const user = await User.findOne({ email });

  if(!user){
    return res.status(404).json({
      message:"User not found"
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 15*60*1000;

  await user.save();

  await notifier.sendResetPasswordEmail(user.email, resetToken);

  res.json({
    message:"Password reset email sent"
  });

});

// Reset Password
router.post("/reset-password/:token", async (req,res)=>{

  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if(!user){
    return res.status(400).json({
      message:"Invalid or expired token"
    });
  }

  const hash = await bcrypt.hash(password,10);

  user.password = hash;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.json({
    message:"Password reset successful"
  });

});


module.exports = router;