const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./db/connect");
const authRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const Chat = require("./db/models/Chat");
const User = require("./db/models/User");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Use CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173", // React frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(authRoutes);
app.use(chatRoutes);

// Track online users
let onlineUsers = {};

// Real-Time Communication
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Handle user login and save userId
  socket.on("user-connected", async (userId) => {
    console.log(`User ${userId} connected`);
    onlineUsers[userId] = socket.id;

    // Notify all clients about online status
    io.emit("online-status", { userId, status: "online" });

    // Send chat history to the connected user (if needed)
    const messages = await Chat.find().sort({ timestamp: 1 });
    socket.emit("chat-history", messages);
  });

  // Handle user disconnect
  socket.on("disconnect", async () => {
    const userId = Object.keys(onlineUsers).find(
      (key) => onlineUsers[key] === socket.id
    );

    if (userId) {
      console.log(`User ${userId} disconnected`);
      delete onlineUsers[userId];

      // Notify all clients about offline status
      io.emit("online-status", { userId, status: "offline" });

      // Update the user's last seen in the database
      try {
        await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
      } catch (error) {
        console.error(`Error updating last seen for user ${userId}:`, error);
      }
    }
  });
});

// Start Server
server.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
