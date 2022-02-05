module.exports = ({ origins, methods, headers }) => {
  return (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origins.join(", "));
    res.setHeader("Access-Control-Allow-Methods", methods.join(", "));
    res.setHeader("Access-Control-Allow-Headers", headers.join(", "));

    next();
  };
};
