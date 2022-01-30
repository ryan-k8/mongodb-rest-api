const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const Doctor = require("../models/doctor");
const Token = require("../models/resetToken");
const {
  doctorSchema,
  loginSchema,
  emailSchema,
  passwordSchema,
} = require("../models/validation/schema");
const sendEmail = require("../util/email");
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

exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.headers["x-auth-refresh-token"];

    if (!token) {
      throw new ExpressError("bad request", 400);
    }

    const uid = await verifyRefreshToken(token);
    await redisClient.del(uid);

    const newAccessToken = await signAccessToken(uid);
    const newRefreshToken = await signRefreshToken(uid);

    res
      .status(200)
      .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const result = await emailSchema.validateAsync(req.body);

    const user = await Doctor.findOne({ email: result.email });

    if (!user) {
      throw new ExpressError("no such user exists", 400);
    }

    let token = await Token.findOne({ email: result.email });

    if (!token) {
      const tokenVal = crypto.randomBytes(16).toString("hex");
      token = await Token.create({
        userId: user._id,
        token: tokenVal,
      });
    }

    const emailText = `
    <h1>reset password</h1>
    /auth/reset-password/${user._id.toString()}/${token.token}
    `;

    await sendEmail(user.email, "reset password", emailText);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

exports.verifyAndResetPassword = async (req, res, next) => {
  try {
    const { userId, token } = req.params;
    const result = await passwordSchema.validateAsync(req.body);

    const user = await Doctor.findById(userId);

    if (!user) {
      throw new ExpressError("invalid link or expired", 400);
    }

    const verified = await Token.verify(token);
    if (!verified) {
      throw new ExpressError("invalid link or expired", 400);
    }

    user.password = result.password;
    await user.save();
    await Token.findOneAndDelete({ userId: userId });

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
