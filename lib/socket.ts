import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | null = null;

export const initSocket = (server: NetServer) => {
  if (!io) {
    console.log("Setting up socket");
    io = new SocketIOServer(server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket"],
      pingTimeout: 60000,
      pingInterval: 25000,
      connectTimeout: 45000,
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("joinImportRoom", (importLogId: string) => {
        const room = `import_${importLogId}`;
        socket.join(room);
        console.log(`Client ${socket.id} joined import room: ${room}`);
      });

      socket.on("leaveImportRoom", (importLogId: string) => {
        const room = `import_${importLogId}`;
        socket.leave(room);
        console.log(`Client ${socket.id} left import room: ${room}`);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    io.on("error", (error) => {
      console.error("Socket.io error:", error);
    });
  }
  return io;
};

export const getIO = () => {
  if (!io) {
    console.warn("Socket.io not initialized, attempting to create a new instance");
    const server = require("http").createServer();
    io = initSocket(server);
  }
  return io;
}; 