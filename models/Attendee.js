const mongoose = require("mongoose");

const AttendeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the attendee name"],
      trim: true,
      maxlength: 20,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
  },
  { timestamps: true }
);

const Attendee = mongoose.model("Attendee", AttendeeSchema);

module.exports = Attendee;
