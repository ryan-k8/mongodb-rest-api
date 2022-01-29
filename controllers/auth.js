const bcrypt = require("bcryptjs");

const Doctor = require("../models/doctor");
const { doctorSchema } = require("../models/validation/schema");
const { ExpressError } = require("../util/err");
const { signAccessToken, signRefreshToken } = require("../util/jwt");

exports.register = async (req, res, next) => {
  try {
    const result = await doctorSchema.validateAsync(req.body);
    const image = req.file;

    const userDoesExist = await Doctor.findOne({ email: result.email });

    if (userDoesExist) {
      throw new ExpressError("user already exists!", 409);
    }

    if (image) {
      result.profileImage = {
        url: image.path,
        cloudinaryId: image.filename.split("/")[1],
      };
    }

    result.password = await bcrypt.hash(result.password, 12);

    const { _id: uid } = await Doctor.create(result);

    const accessToken = await signAccessToken(uid.toString());
    const refreshToken = await signRefreshToken(uid.toString());

    return res.status(201).json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};
