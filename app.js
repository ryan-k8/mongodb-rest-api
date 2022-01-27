const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const errHandler = require("./middlewares/errhandler");

require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use(errHandler);

module.exports = app;
