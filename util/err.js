const { MulterError } = require("multer");

class ExpressError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = statusCode;
  }
}

class UploadError extends MulterError {
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
    this.message = message;
  }
}

module.exports = { ExpressError, UploadError };
