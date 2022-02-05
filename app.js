const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

require("dotenv").config();

const cors = require("./middlewares/cors");
const authRoutes = require("./routes/auth");
const patientRoutes = require("./routes/patient");
const reportRoutes = require("./routes/report");

const errHandler = require("./middlewares/errhandler");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use(
  cors({
    origins: ["*"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    headers: ["Content-Type", "Authorization", "X-Auth-Refresh-Token"],
  })
);

app.use("/auth", authRoutes);
app.use("/patients", patientRoutes);
app.use("/reports", reportRoutes);

app.use("/", (req, res) => res.sendStatus(404));

app.use(errHandler);

module.exports = app;
