const Attendee = require("../models/Attendee");
const Event = require("../models/Event"); 
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllAttendees = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.userId;


  const event = await Event.findOne({ _id: eventId, createdBy: userId });
  if (!event) {
    throw new UnauthorizedError(
      "You are not authorized to view this event's attendees"
    );
  }

  const attendees = await Attendee.find({ event: eventId }).sort("name");
  res.status(StatusCodes.OK).json({ attendees, count: attendees.length });
};

const getAttendee = async (req, res) => {
  const { eventId, id: attendeeId } = req.params;
  const userId = req.user.userId;


  const event = await Event.findOne({ _id: eventId, createdBy: userId });
  if (!event) {
    throw new UnauthorizedError("You are not authorized to view this attendee");
  }

  const attendee = await Attendee.findOne({ _id: attendeeId, event: eventId });
  if (!attendee) {
    throw new NotFoundError(`No attendee found with id ${attendeeId}`);
  }
  res.status(StatusCodes.OK).json({ attendee });
};

const createAttendee = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.userId;


  const event = await Event.findOne({ _id: eventId, createdBy: userId });
  if (!event) {
    throw new UnauthorizedError(
      "You are not authorized to add attendees to this event"
    );
  }

  req.body.event = eventId;
  const attendee = await Attendee.create(req.body);
  res.status(StatusCodes.CREATED).json({ attendee });
};

const updateAttendee = async (req, res) => {
  const { eventId, id: attendeeId } = req.params;
  const { name, email } = req.body;
  const userId = req.user.userId;


  const event = await Event.findOne({ _id: eventId, createdBy: userId });
  if (!event) {
    throw new UnauthorizedError(
      "You are not authorized to update attendees for this event"
    );
  }

  if (!name || !email) {
    throw new BadRequestError("Name and email fields cannot be empty");
  }

  const attendee = await Attendee.findByIdAndUpdate(
    { _id: attendeeId, event: eventId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!attendee) {
    throw new NotFoundError(`No attendee found with id ${attendeeId}`);
  }

  res.status(StatusCodes.OK).json({ attendee });
};

const deleteAttendee = async (req, res) => {
  const { eventId, id: attendeeId } = req.params;
  const userId = req.user.userId;

  // Check if the event belongs to the user
  const event = await Event.findOne({ _id: eventId, createdBy: userId });
  if (!event) {
    throw new UnauthorizedError(
      "You are not authorized to delete attendees from this event"
    );
  }

  const attendee = await Attendee.findByIdAndRemove({
    _id: attendeeId,
    event: eventId,
  });

  if (!attendee) {
    throw new NotFoundError(`No attendee found with id ${attendeeId}`);
  }

  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllAttendees,
  getAttendee,
  createAttendee,
  updateAttendee,
  deleteAttendee,
};
