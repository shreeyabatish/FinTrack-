
const User = require("../models/User");

// Award points to a user for an action
exports.awardPoints = async (user, action) => {
  try {
    let points = 0;

    switch (action) {
      case "transactionLogged":
        points = 10;
        break;
      case "goalCreated":
        points = 20;
        break;
      case "budgetCreated":
        points = 15;
        break;
      case "goalCompleted":
        points = 30;
        break;
      default:
        points = 5;
    }

    user.xp = (user.xp || 0) + points;

    // Level up for every 100 XP earned
    while (user.xp >= 100) {
      user.level = (user.level || 1) + 1;
      user.xp -= 100;
    }

    await user.save();
  } catch (err) {
    console.error("Error awarding points:", err);
    throw err;
  }
};

// Get rewards for the authenticated user
exports.getRewards = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("xp level");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      xp: user.xp,
      level: user.level,
    });
  } catch (err) {
    console.error("Error fetching rewards:", err);
    return res.status(500).json({ error: "Failed to fetch rewards" });
  }
};

// Leaderboard: Top users by level and XP
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select("email xp level")
      .sort({ level: -1, xp: -1 })
      .limit(10);

    const leaderboard = users.map((user) => ({
      email: user.email,
      xp: user.xp,
      level: user.level,
    }));

    return res.status(200).json({ leaderboard });
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    return res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};
