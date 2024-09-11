const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: [true, "Please provide the event name"],
    },
    description: {
      type: String,
      maxlength: [400, "Description cannot be more than 400 characters"],
    },
    date: {
      type: Date,
      required: [true, "Please provide the event date"],
    },
    location: {
      type: String,
      maxlength: 200, 
    },
    eventType: {
      type: String,
      enum: ["conference", "workshop", "network"],
      required: [true, "Please specify an event type"],
    },
    //stores the ID of the user who created the event
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
