
const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

const { getRewards } = require("../controllers/rewardsController");
const authMiddleware = require("../middleware/authMiddleware");

// Signup and login
router.post("/signup", signup);
router.post("/login", login);

// Protected profile routes
router.get("/profile", authMiddleware, getProfile);
router.patch("/profile", authMiddleware, updateProfile);

// Protected rewards route
router.get("/rewards", authMiddleware, getRewards);

module.exports = router;
