let io;

module.exports = {
  init: (server) => {
    io = require("socket.io")(server, {
      cors: { 
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
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
