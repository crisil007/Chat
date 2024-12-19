const express = require("express");
const { getMessages, sendMessage } = require("../controllers/chatController");
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_SECRET = "your_jwt_secret";

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access Denied" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid Token" });
    req.user = user;
    next();
  });
};

router.get("/", authenticateToken, getMessages);
router.post("/send", authenticateToken, sendMessage);

module.exports = router;
