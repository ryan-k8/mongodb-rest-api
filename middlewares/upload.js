const { MulterError } = require("multer");
const multer = require("multer");
const { cloudinary, storage } = require("../util/cloudinary");
const { UploadError } = require("../util/err");

const MAXFILESIZE = 1000 * 1024 * 5;
const allowedFormats = ["image/jpeg", "image/jpg", "image/png"];

module.exports = multer({
  storage: storage,
  limits: { fileSize: MAXFILESIZE },
  fileFilter: (req, file, cb) => {
    if (!allowedFormats.includes(file.mimetype)) {
      cb(new UploadError("only jpeg/png/jpg images allowed!"));
    }

    cb(null, true);
  },
});
