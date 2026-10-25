
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config();

const app = express();

// =========================
// CORS CONFIGURATION
// Local development only
// =========================

app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// =========================
// MONGODB CONNECTION
// =========================

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing from the .env file");
} else {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("✅ MongoDB connected");
    })
    .catch((err) => {
      console.error(
        "❌ MongoDB connection error:",
        err.message
      );
    });
}

// =========================
// IMPORT ROUTES
// =========================

const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transaction");
const goalRoutes = require("./routes/goal");
const budgetRoutes = require("./routes/budget");
const rewardsRoutes = require("./routes/rewards");

// =========================
// REGISTER ROUTES
// =========================

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/rewards", rewardsRoutes);

// =========================
// HEALTH CHECK
// =========================

app.get("/", (req, res) => {
  res.send("🚀 Backend is running with CORS enabled.");
});

// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
