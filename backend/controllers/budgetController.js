const Budget = require("../models/Budget");
const User = require("../models/User");
const { awardPoints } = require("./rewardsController");

// GET all budgets
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).lean();
    res.json(budgets);
  } catch (err) {
    console.error("Error fetching budgets:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// POST create a budget
exports.addBudget = async (req, res) => {
  try {
    const { category, amount } = req.body;

    // ✅ Validation
    if (!category) return res.status(400).json({ error: "Category is required" });
    if (!amount || amount <= 0) return res.status(400).json({ error: "Amount must be greater than 0" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ Prevent duplicate category budgets for same user
    const existing = await Budget.findOne({ user: req.user.id, category });
    if (existing) return res.status(400).json({ error: "Budget for this category already exists" });

    const budget = new Budget({ user: req.user.id, category, amount });
    await budget.save();

    await awardPoints(user, "budgetCreated");

    res.status(201).json({
      message: "Budget created",
      budget,
      xp: user.xp,
      level: user.level
    });
  } catch (err) {
    console.error("Error creating budget:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT update a budget
exports.updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category } = req.body;

    const budget = await Budget.findOne({ _id: id, user: req.user.id });
    if (!budget) return res.status(404).json({ error: "Budget not found" });

    if (amount && amount <= 0) return res.status(400).json({ error: "Amount must be greater than 0" });

    budget.amount = amount !== undefined ? Number(amount) : budget.amount;
    budget.category = category || budget.category;

    await budget.save();
    res.json({ message: "Budget updated", budget });
  } catch (err) {
    console.error("Error updating budget:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE a budget
exports.deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findOneAndDelete({ _id: id, user: req.user.id });
    if (!budget) return res.status(404).json({ error: "Budget not found" });

    res.json({ message: "Budget deleted" });
  } catch (err) {
    console.error("Error deleting budget:", err);
    res.status(500).json({ error: "Server error" });
  }
};
