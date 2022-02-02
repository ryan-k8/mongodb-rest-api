const mongoose = require("mongoose");
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@dev-cluster.gmixj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

module.exports = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((done) => resolve("connected"))
      .catch((err) => reject(err));
  });
};
