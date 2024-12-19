const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./db/connect");
const authRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const Chat = require("./db/models/Chat");
const dotenv=require('dotenv');
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React frontend URL
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());
app.use( authRoutes);
app.use( chatRoutes);

// Real-Time Communication
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Broadcast existing messages on new connection
  Chat.find()
    .sort({ timestamp: 1 })
    .then((messages) => {
      socket.emit("chat-history", messages);
    });

  // Listen for incoming messages
  socket.on("send-message", async (data) => {
    const { sender, message } = data;

    // Save the message in the database
    const newMessage = new Chat({ sender, message });
    await newMessage.save();

    // Broadcast the new message to all connected clients
    io.emit("receive-message", newMessage);
  });

  // Handle user disconnecting
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start Server

server.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
