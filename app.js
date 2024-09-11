require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// connectDB
connectDB = require("./db/connect");
//authenticateUser
const authenticateUser = require("./middleware/authentication");

//routers
const authRouter = require("./routes/auth");
const eventsRouter = require("./routes/events");
const attendeesRouter = require("./routes/attendees");
const remindersRouter = require("./routes/reminders");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.use(express.json());
// extra packages

// routes
app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/events", authenticateUser, goalsRouter);
app.use("/api/v1/events", authenticateUser, eventsRouter);
//do similar as above for attendee route and reminder route
app.use("/api/v1/events/:eventId/attendees", authenticateUser, attendeesRouter);
app.use("/api/v1/events/:eventId/reminders", authenticateUser, remindersRouter);

// app.get("/", (req, res) => {
//   res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
// });

app.use(express.static("public"));

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
