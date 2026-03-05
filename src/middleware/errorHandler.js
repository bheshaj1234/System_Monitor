module.exports = (err, req, res, next) => {
  console.error("ERROR 💥", err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    // sirf dev me stack dikhao
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};
