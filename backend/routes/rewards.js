const express = require("express");
const router = express.Router();
const rewardsController = require("../controllers/rewardsController");
const authMiddleware = require("../middleware/authMiddleware");

// GET current XP and level
router.get("/", authMiddleware, rewardsController.getRewards);

// GET leaderboard
router.get("/leaderboard", authMiddleware, rewardsController.getLeaderboard);

module.exports = router;
