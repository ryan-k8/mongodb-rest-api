const mongoose = require("mongoose");
const Doctor = require("../../models/doctor");
const Token = require("../../models/resetToken");
const connectDb = require("../../util/db");
const testUserOneId = new mongoose.Types.ObjectId();

const testUserOne = {
  _id: testUserOneId,
  name: "test User One",
  email: "testuserone@gmail.com",
  password: "testuserone",
};

const setupDatabase = async () => {
  await connectDb();
  await Doctor.deleteMany();
  await Token.deleteMany();
  const __testUser__ = new Doctor(testUserOne);
  await __testUser__.save();
};

const cleanDatabase = async () => {
  await Doctor.deleteMany();
  await Token.deleteMany();
};

module.exports = {
  testUserOneId,
  testUserOne,
  setupDatabase,
  cleanDatabase,
};
