const bcrypt = require("bcryptjs");

const Doctor = require("../models/doctor");
const { doctorSchema, loginSchema } = require("../models/validation/schema");
const { ExpressError } = require("../util/err");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../util/jwt");
const redisClient = require("../util/tokenstore");

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

exports.login = async (req, res, next) => {
  try {
    const result = await loginSchema.validateAsync(req.body);

    const { id: uid } = await Doctor.findByCredentials(result);

    const accessToken = await signAccessToken(uid.toString());
    const refreshToken = await signRefreshToken(uid.toString());

    res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const token = req.headers["x-auth-refresh-token"];

    if (!token) {
      throw new ExpressError("bad request", 400);
    }

    const uid = await verifyRefreshToken(token);
    await redisClient.del(uid);

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
