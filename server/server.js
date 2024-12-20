const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./db/connect");
const authRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const Chat = require("./db/models/Chat");
const dotenv = require("dotenv");
const cors = require("cors"); // Added CORS import

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Use CORS middleware
app.use(cors({
  origin: "http://localhost:5173", // Updated to match your React frontend URL
  methods: ["GET", "POST"],        // Allowed methods
  credentials: true,               // Allow cookies and credentials
}));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Updated to match your React frontend URL
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());
app.use(authRoutes);
app.use(chatRoutes);

// Real-Time Communication
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  Chat.find()
    .sort({ timestamp: 1 })
    .then((messages) => {
      socket.emit("chat-history", messages);
    });

  socket.on("send-message", async (data) => {
    const { sender, message } = data;
    const newMessage = new Chat({ sender, message });
    await newMessage.save();
    io.emit("receive-message", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start Server
server.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
