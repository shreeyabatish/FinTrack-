const Goal = require("../models/Goal");
const User = require("../models/User");
const { awardPoints } = require("./rewardsController");

// GET all goals
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).lean();
    res.json(goals);
  } catch (err) {
    console.error("Error fetching goals:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// POST create a goal
exports.addGoal = async (req, res) => {
  try {
    const { title, target, saved } = req.body;

    // ✅ Validation
    if (!title) return res.status(400).json({ error: "Title is required" });
    if (!target || target <= 0) return res.status(400).json({ error: "Target must be greater than 0" });
    if (saved < 0) return res.status(400).json({ error: "Saved amount cannot be negative" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const goal = new Goal({ user: req.user.id, title, target, saved });
    await goal.save();

    await awardPoints(user, "goalCreated");

    res.status(201).json({
      message: "Goal created",
      goal,
      xp: user.xp,
      level: user.level
    });
  } catch (err) {
    console.error("Error creating goal:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT update a goal

exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, target, saved } = req.body;

    const goal = await Goal.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        error: "Goal not found",
      });
    }

    // Remember whether the goal was already completed
    // before applying this update.
    const wasCompleted =
      goal.completed ||
      Number(goal.saved) >= Number(goal.target);

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          error: "Goal title is required",
        });
      }

      goal.title = title.trim();
    }

    if (target !== undefined) {
      const targetAmount = Number(target);

      if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
        return res.status(400).json({
          error: "Target must be greater than 0",
        });
      }

      goal.target = targetAmount;
    }

    if (saved !== undefined) {
      const savedAmount = Number(saved);

      if (!Number.isFinite(savedAmount) || savedAmount < 0) {
        return res.status(400).json({
          error: "Saved amount cannot be negative",
        });
      }

      goal.saved = savedAmount;
    }

    const isCompleted =
      Number(goal.saved) >= Number(goal.target);

    goal.completed = isCompleted;

    // Award completion points at most once per goal.
    if (isCompleted && !goal.completionRewardAwarded) {
      if (!wasCompleted) {
        const user = await User.findById(req.user.id);

        if (user) {
          await awardPoints(user, "goalCompleted");
        }
      }

      // Also mark previously completed goals as processed
      // to prevent retroactive duplicate rewards.
      goal.completionRewardAwarded = true;
    }

    await goal.save();

    return res.json({
      message: "Goal updated",
      goal,
    });
  } catch (err) {
    console.error("Error updating goal:", err);

    return res.status(500).json({
      error: "Server error",
    });
  }
};

// DELETE a goal
exports.deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const goal = await Goal.findOneAndDelete({ _id: id, user: req.user.id });
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    res.json({ message: "Goal deleted" });
  } catch (err) {
    console.error("Error deleting goal:", err);
    res.status(500).json({ error: "Server error" });
  }
};
