const Reminder = require("../models/Reminder");
const Event = require("../models/Event");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllReminders = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.userId;

  const event = await Event.findOne({ _id: eventId, createdBy: userId });
  if (!event) {
    throw new UnauthorizedError(
      "You are not authorized to view this event's reminders"
    );
  }

  const reminders = await Reminder.find({ event: eventId }).sort(
    "reminderTime"
  );
  res.status(StatusCodes.OK).json({ reminders, count: reminders.length });
};

const getReminder = async (req, res) => {
  const { eventId, id: reminderId } = req.params;
  const userId = req.user.userId;

  const event = await Event.findOne({ _id: eventId, createdBy: userId });
  if (!event) {
    throw new UnauthorizedError("You are not authorized to view this reminder");
  }

  const reminder = await Reminder.findOne({ _id: reminderId, event: eventId });
  if (!reminder) {
    throw new NotFoundError(`No reminder found with id ${reminderId}`);
  }
  res.status(StatusCodes.OK).json({ reminder });
};

const createReminder = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.userId;

  const event = await Event.findOne({ _id: eventId, createdBy: userId });
  if (!event) {
    throw new UnauthorizedError(
      "You are not authorized to add reminders to this event"
    );
  }

  req.body.event = eventId; // Associate the reminder with the event
  req.body.user = userId; // Associate the reminder with the user making the request

  const reminder = await Reminder.create(req.body);
  res.status(StatusCodes.CREATED).json({ reminder });
};

const updateReminder = async (req, res) => {
  const { eventId, id: reminderId } = req.params;
  const { reminderTime } = req.body;
  const userId = req.user.userId;

  // Check if the event belongs to the user
  const event = await Event.findOne({ _id: eventId, createdBy: userId });
  if (!event) {
    throw new UnauthorizedError(
      "You are not authorized to update reminders for this event"
    );
  }

  if (!reminderTime) {
    throw new BadRequestError("Reminder time field cannot be empty");
  }

  const reminder = await Reminder.findByIdAndUpdate(
    { _id: reminderId, event: eventId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!reminder) {
    throw new NotFoundError(`No reminder found with id ${reminderId}`);
  }

  res.status(StatusCodes.OK).json({ reminder });
};

const deleteReminder = async (req, res) => {
  const { eventId, id: reminderId } = req.params;
  const userId = req.user.userId;

  const event = await Event.findOne({ _id: eventId, createdBy: userId });
  if (!event) {
    throw new UnauthorizedError(
      "You are not authorized to delete reminders from this event"
    );
  }

  const reminder = await Reminder.findByIdAndRemove({
    _id: reminderId,
    event: eventId,
  });

  if (!reminder) {
    throw new NotFoundError(`No reminder found with id ${reminderId}`);
  }

  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllReminders,
  getReminder,
  createReminder,
  updateReminder,
  deleteReminder,
};
