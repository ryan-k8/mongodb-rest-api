const { ExpressError } = require("../util/err");

module.exports = (permission) => {
  return async (req, res, next) => {
    try {
      const allowed = await permission({ ...req.user, ...req.params });

      if (!allowed) {
        const err = new ExpressError("forbidden", 403);
        next(err);
      }

      next();
    } catch (err) {
      console.log(err);
    }
  };
};
