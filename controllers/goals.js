const Goal = require("../models/Goal");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const getAllGoals = async (req, res) => {
  res.send("Get all goals");
};

const getGoal = async (req, res) => {
  res.send("Get goal");
};
const createGoal = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const goal = await Goal.create(req.body);
  res.status(StatusCodes.CREATED).json({ goal });
};
const updateGoal = async (req, res) => {
  res.send("Update goal");
};
const deleteGoal = async (req, res) => {
  res.send("Delete goal");
};

module.exports = {
  getAllGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
};
