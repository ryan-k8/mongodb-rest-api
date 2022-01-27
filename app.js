const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const { cloudinary, storage } = require("./util/cloudinary");
const upload = require("./middlewares/upload");

const { MulterError } = require("multer");

require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use((err, req, res, next) => {
  try {
    if (err instanceof MulterError) {
      console.log(err);
      return res.status(400).json({
        error: {
          detail: err.message,
        },
      });
    }

    res.status(500).json({
      error: {
        detail: "internal server error",
      },
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = app;
