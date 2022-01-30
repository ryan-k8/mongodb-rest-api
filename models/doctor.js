const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { ExpressError } = require("../util/err");

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

doctorSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

doctorSchema.statics.findByCredentials = async function ({ email, password }) {
  try {
    const user = await Doctor.findOne({ email: email });

    if (!user) {
      throw new ExpressError("no such user exists", 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new ExpressError("incorrect password", 401);
    }

    return { id: user._id };
  } catch (err) {
    throw err;
  }
};
const Doctor = mongoose.model("doctor", doctorSchema);
module.exports = Doctor;
