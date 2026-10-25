
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const { awardPoints } = require("./rewardsController");

// GET all transactions for the logged-in user
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return res.status(500).json({
      error: "Failed to fetch transactions",
    });
  }
};

// POST add a new transaction
exports.addTransaction = async (req, res) => {
  try {
    const { title, category, amount, type } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "Title is required",
      });
    }

    if (
      amount === undefined ||
      amount === null ||
      amount === "" ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) <= 0
    ) {
      return res.status(400).json({
        error: "Amount must be greater than 0",
      });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({
        error: "Category is required",
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        error: "Type must be 'income' or 'expense'",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const transaction = new Transaction({
      user: user._id,
      title: title.trim(),
      category: category.trim(),
      amount: Number(amount),
      type,
    });

    await transaction.save();

    await awardPoints(user, "transactionLogged");

    return res.status(201).json({
      message: "Transaction added successfully",
      transaction,
      xp: user.xp,
      level: user.level,
    });
  } catch (err) {
    console.error("Error creating transaction:", err);
    return res.status(500).json({
      error: "Failed to create transaction",
    });
  }
};

// PUT update a transaction belonging to the logged-in user
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, amount, type } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        error: "Invalid transaction ID",
      });
    }

    const transaction = await Transaction.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        error: "Transaction not found",
      });
    }

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          error: "Title cannot be empty",
        });
      }
      transaction.title = title.trim();
    }

    if (category !== undefined) {
      if (typeof category !== "string" || !category.trim()) {
        return res.status(400).json({
          error: "Category cannot be empty",
        });
      }
      transaction.category = category.trim();
    }

    if (amount !== undefined) {
      if (
        amount === "" ||
        !Number.isFinite(Number(amount)) ||
        Number(amount) <= 0
      ) {
        return res.status(400).json({
          error: "Amount must be greater than 0",
        });
      }
      transaction.amount = Number(amount);
    }

    if (type !== undefined) {
      if (!["income", "expense"].includes(type)) {
        return res.status(400).json({
          error: "Type must be 'income' or 'expense'",
        });
      }
      transaction.type = type;
    }

    await transaction.save();

    return res.status(200).json({
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (err) {
    console.error("Error updating transaction:", err);
    return res.status(500).json({
      error: "Failed to update transaction",
    });
  }
};

// DELETE a transaction belonging to the logged-in user
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        error: "Invalid transaction ID",
      });
    }

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        error: "Transaction not found",
      });
    }

    return res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    return res.status(500).json({
      error: "Failed to delete transaction",
    });
  }
};
