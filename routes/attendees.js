
const express = require("express");
const router = express.Router({ mergeParams: true }); //allows child routers to access the parent's route parameters defined in app.js

const {
  getAllAttendees,
  getAttendee,
  createAttendee,
  updateAttendee,
  deleteAttendee,
} = require("../controllers/attendees");


router.route("/").get(getAllAttendees).post(createAttendee);
router
  .route("/:id")
  .get(getAttendee)
  .patch(updateAttendee)
  .delete(deleteAttendee);

module.exports = router;
