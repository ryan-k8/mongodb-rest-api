const { ExpressError } = require("../util/err");

module.exports = (permission) => {
  return async (req, res, next) => {
    try {
      const [err, allowed] = await permission({
        ...req.user,
        ...req.params,
      });

      if (err) {
        if (err.isJoi) {
          err.isJoi = false;
          next(new ExpressError("invalid id type", 400));
        }
        next(err);
      }

      if (!allowed) {
        next(new ExpressError("forbidden", 403));
      }

      next();
    } catch (err) {
      console.log(err);
    }
  };
};
