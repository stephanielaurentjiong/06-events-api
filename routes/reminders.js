// routes/reminderRoutes.js
const express = require("express");
const router = express.Router({ mergeParams: true }); //allows child routers to access the parent's route parameters defined in app.js

const {
  getAllReminders,
  getReminder,
  createReminder,
  updateReminder,
  deleteReminder,
} = require("../controllers/reminders");

router.route("/").get(getAllReminders).post(createReminder);
router
  .route("/:id")
  .get(getReminder)
  .patch(updateReminder)
  .delete(deleteReminder);

module.exports = router;
