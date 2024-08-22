const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema(
  {
    goalName: {
      type: String,
      required: [true, "Provide your goal title"],
    },
    description: {
      type: String,
      maxlength: 100,
    },
    category: {
      type: String,
      enum: ["personal", "professional", "educational", "health"],
      default: "personal",
    },
    status: {
      type: String,
      enum: ["not started", "in-progress", "completed"],
      default: "not started",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", GoalSchema);
