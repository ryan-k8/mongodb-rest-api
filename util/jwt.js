const jwt = require("jsonwebtoken");

const { ExpressError } = require("./err");

require("dotenv").config();

const redisClient = require("./tokenstore");

module.exports = {
  signAccessToken: (uid) => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { id: uid },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
          audience: uid,
        },
        (err, token) => {
          if (err) {
            reject(err);
          }

          resolve(token);
        }
      );
    });
  },
  signRefreshToken: async (uid) => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { id: uid },
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: "7d",
          audience: uid,
        },
        (err, token) => {
          if (err) {
            reject(err);
          }
          resolve(token);
        }
      );
    });
  },
  verifyAccessToken: async (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          const errmsg =
            err.name === "JsonWebTokenError" ? "unauthorized" : err.message;
          reject(new ExpressError(errmsg, 401));
        }

        resolve(decoded);
      });
    });
  },
  verifyRefreshToken: async (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) {
          const errmsg =
            err.name === "JsonWebTokenError" ? "unauthorized" : err.message;
          reject(new ExpressError(errmsg, 401));
        }

        const { id: uid } = decoded;
        let result;

        redisClient.get(uid).then((res) => (result = res));

        if (token !== result) {
          reject(new ExpressError("unauthorized", 401));
        }

        resolve(uid);
      });
    });
  },
};
