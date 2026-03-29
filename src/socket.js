let io;

module.exports = {
  init: (server) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    io = require("socket.io")(server, {
      cors: { 
        origin: function (origin, callback) {
          if (!origin || allowedOrigins.some(url => origin.startsWith(url))) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
        credentials: true
      }
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);
    });
  },

  getIO: () => {
    if (!io) {
      throw new Error("Socket not initialized");
    }
    return io;
  }
};
