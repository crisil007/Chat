// userController.js
const User = require("../db/models/User");

// Get all users (excluding password)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password from response
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
exports.getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password"); // Exclude password from response
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    } catch (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  };