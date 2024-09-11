const Event = require("../models/Event");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllEvents = async (req, res) => {
  //req.user.userId comes from your authentication middleware and represents the ID of the currently logged-in user
  const events = await Event.find({ createdBy: req.user.userId }).sort("date");
  res.status(StatusCodes.OK).json({ events, count: events.length });
};

const getEvent = async (req, res) => {
  const {user: { userId }, params: { id: eventId },} = req;

  const event = await Event.findOne({
    _id: eventId,
    createdBy: userId,
  });

  if (!event) {
    throw new NotFoundError(`No event found with id ${eventId}`);
  }
  res.status(StatusCodes.OK).json({ event });
};
const createEvent = async (req, res) => {
  // createdBy field stores the unique identifier (userId) of the user who created the event
  // get info from user and add it together the userId object
  req.body.createdBy = req.user.userId;
  const event = await Event.create(req.body);
  res.status(StatusCodes.CREATED).json({ event });
};

const updateEvent = async (req, res) => {
  const {
    // Extracts the event details from the request body.
    // This is the data sent by the client to update the event.
    body: { eventName, description, date, location },
    // Extracts the user ID from the authenticated user's information.
    // This ID is used to ensure that the user making the request is authorized to update the event.
    user: { userId },
    // Extracts the event ID from the request parameters.
    // This ID specifies which event needs to be updated.
    params: { id: eventId },
  } = req;

  if (!eventName || !date || !location) {
    throw new BadRequestError(
      "Name, date, and location fields cannot be empty"
    );
  }

  const event = await Event.findByIdAndUpdate(
    { _id: eventId, createdBy: userId }, //find
    req.body, //contains the new data sent from client
    { new: true, runValidators: true }
  );

  console.log("Update request body:", req.body);

  if (!event) {
    throw new NotFoundError(`No event found with id ${eventId}`);
  }

  res.status(StatusCodes.OK).json({ event });
};

const deleteEvent = async (req, res) => {
  const {
    user: { userId },
    params: { id: eventId },
  } = req;
  const event = await Event.findByIdAndRemove({
    _id: eventId,
    createdBy: userId,
  });

  if (!event) {
    throw new NotFoundError(`No event found with id ${eventId}`);
  }
  // an empty body is not valid JSON
  res.status(StatusCodes.NO_CONTENT).send({ event });
};

module.exports = {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
};
