const express = require("express");
const { register, login } = require("../controllers/authController");
const { getUsers,getUserById } = require("../controllers/userController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/users", getUsers)
router.get("/users/:id", getUserById);
module.exports = router;
