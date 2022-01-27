const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const { cloudinary, storage } = require("./util/cloudinary");
const upload = require("./middlewares/upload");
const errHandler = require("./middlewares/errhandler");

const { MulterError } = require("multer");

require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use(errHandler);

module.exports = app;
