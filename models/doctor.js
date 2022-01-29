const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const doctorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    profileImage: {
      url: {
        type: String,
        required: true,
        default:
          "https://res.cloudinary.com/chidori-k97/image/upload/v1643456563/nosql-restapi/default-user_kvcpvr.jpg",
      },
      cloudinaryId: {
        type: String,
        default: "default-user_kvcpvr",
      },
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("doctor", doctorSchema);
module.exports = Doctor;
