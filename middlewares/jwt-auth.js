const jwt = require("jsonwebtoken");

const Doctor = require("../models/doctor");
const { verifyAccessToken } = require("../util/jwt");
const { ExpressError } = require("../util/err");

module.exports = async (req, res, next) => {
  try {
    if (!req.headers["authorization"]) {
      throw new ExpressError("unauthorized", 401);
    }

    const bearerToken = req.headers["authorization"].split(" ");
    const token = bearerToken[1];

    const { id } = await verifyAccessToken(token);

    req.user = { uid: id };

    next();
  } catch (err) {
    next(err);
  }
};
