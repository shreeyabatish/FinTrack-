
const express = require("express");
const router = express.Router();

const goalController = require("../controllers/goalController");
const authMiddleware = require("../middleware/authMiddleware");

// Get all goals
router.get(
  "/",
  authMiddleware,
  goalController.getGoals
);

// Create a goal
router.post(
  "/",
  authMiddleware,
  goalController.addGoal
);

// Update a goal
router.put(
  "/:id",
  authMiddleware,
  goalController.updateGoal
);

// Delete a goal
router.delete(
  "/:id",
  authMiddleware,
  goalController.deleteGoal
);

module.exports = router;
