const cloudinary = require("cloudinary").v2;
const crypto = require("crypto");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedFormats = ["image/jpeg", "image/jpg", "image/png"];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (!allowedFormats.includes(file.mimetype)) {
      throw new UploadError(
        `only files of mimetype ${allowedFormats.join(",")} are allowed`
      );
    }

    return {
      folder: process.env.CLOUDINARY_FOLDER_NAME,
      public_id: crypto.randomBytes(16).toString("hex"),
    };
  },
});

module.exports = {
  cloudinary,
  storage,
};
