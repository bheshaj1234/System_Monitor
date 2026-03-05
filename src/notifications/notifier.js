const nodemailer = require('nodemailer');   
const dotenv = require('dotenv');
const config = require("../config/env");
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_PASSWORD, // The 16-character App Password
  },
});

const sendAlertEmail = async (userEmail, service) => {
    await transporter.sendMail({
        from: `"System Monitor" <${process.env.ALERT_EMAIL}>`,
        to: userEmail,
        subject: `🚨 ${service.name} is DOWN`,
        text: `The service "${service.name}" is currently down. Please check the system status.`
    });
}

module.exports = { sendAlertEmail };