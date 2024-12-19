const User = require("../db/models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_jwt_secret";
exports.register = async (req, res) => {
    try {
      console.log(req.body); // Debug incoming request body
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
  
      const user = new User({ username, password });
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error(err); // Log the error
      res.status(400).json({ error: "Registration failed", details: err.message });
    }
  };
  

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
      return res.json({ message: "Login successful", token });
    }

    res.status(401).json({ error: "Invalid credentials" });
  } catch (err) {
    res.status(400).json({ error: "Login failed", details: err.message });
  }
};
