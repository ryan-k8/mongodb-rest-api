module.exports = (err, req, res, next) => {
  try {
    if (err instanceof MulterError) {
      return res.status(400).json({
        error: {
          detail: err.message,
        },
      });
    }

    res.status(500).json({
      error: {
        detail: "internal server error",
      },
    });
  } catch (err) {
    console.log(err);
  }
};
