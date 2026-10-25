const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    target: { type: Number, required: true, min: 1 },
    saved: { type: Number, default: 0, min: 0 },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    completionRewardAwarded: {
  type: Boolean,
  default: false,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);
