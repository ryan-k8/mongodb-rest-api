const mongoose = require("mongoose");
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@dev-cluster.gmixj.mongodb.net/nosql-restapi?retryWrites=true&w=majority`;

module.exports = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("connected to MONGODB...");
  } catch (err) {
    console.log(err);
  }
};
