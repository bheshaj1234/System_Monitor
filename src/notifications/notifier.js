const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_PASSWORD
  }
});

// =============================
// SERVICE DOWN ALERT
// =============================
const sendAlertEmail = async (userEmail, service) => {

  await transporter.sendMail({
    from: `"System Monitor" <${process.env.ALERT_EMAIL}>`,
    to: userEmail,
    subject: `🚨 ${service.name} is DOWN`,
    text: `The service "${service.name}" is currently down. Please check the system status.`
  });

};


// =============================
// EMAIL VERIFICATION
// =============================
const sendVerificationEmail = async (userEmail, token) => {

  const verifyLink = `http://localhost:3000/verify-email/${token}`;

  await transporter.sendMail({
    from: `"System Monitor" <${process.env.ALERT_EMAIL}>`,
    to: userEmail,
    subject: "Verify your email",
    html: `
      <h2>Verify Your Email</h2>
      <p>Click the button below to verify your email</p>

      <a href="${verifyLink}" 
      style="
      padding:10px 20px;
      background:#2563eb;
      color:white;
      text-decoration:none;
      border-radius:6px;
      ">
      Verify Email
      </a>

      <p>If you didn't create this account ignore this email.</p>
    `
  });

};

// =============================
// PASSWORD RESET (TO BE IMPLEMENTED)
// =============================
const sendResetPasswordEmail = async (email, token)=>{

  const resetLink =
  `http://localhost:3000/reset-password/${token}`;

  await transporter.sendMail({

    from:`"System Monitor" <${process.env.ALERT_EMAIL}>`,

    to:email,

    subject:"Reset Your Password",

    html:`
      <h2>Password Reset</h2>

      <p>Click below to reset password</p>

      <a href="${resetLink}"
      style="
      padding:10px 20px;
      background:#2563eb;
      color:white;
      border-radius:6px;
      text-decoration:none;">
      Reset Password
      </a>

      <p>Link expires in 15 minutes</p>
    `
  });

};


module.exports = {
  sendAlertEmail,
  sendVerificationEmail,
  sendResetPasswordEmail
};
