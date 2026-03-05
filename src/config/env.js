module.exports = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  alertEmail: process.env.ALERT_EMAIL,
  alertPass: process.env.ALERT_PASSWORD,
  nodeEnv: process.env.NODE_ENV || "development"
};
