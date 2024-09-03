// models/Reminder.js
const mongoose = require("mongoose");

const ReminderSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reminderTime: {
      type: Date,
      required: [true, "Please provide the reminder time"],
    },
    notified: {
      type: Boolean,
      default: false, //default is off
    },
  },
  { timestamps: true }
);

const Reminder = mongoose.model("Reminder", ReminderSchema);

module.exports = Reminder;
