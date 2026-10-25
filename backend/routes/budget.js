const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Routes
router.get("/", authMiddleware, budgetController.getBudgets);
router.post("/", authMiddleware, budgetController.addBudget);
router.put("/:id", authMiddleware, budgetController.updateBudget);
router.delete("/:id", authMiddleware, budgetController.deleteBudget);

module.exports = router;
