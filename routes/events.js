//All set!
const express = require("express");
const router = express.Router();

const {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/events");

router.route("/").get(getAllEvents).post(createEvent);
router.route("/:id").get(getEvent).patch(updateEvent).delete(deleteEvent);

module.exports = router;
