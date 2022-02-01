const mongoose = require("mongoose");
const Doctor = require("../../models/doctor");

const testUserOneId = new mongoose.Types.ObjectId();

const testUserOne = {
  _id: testUserOneId,
  name: "test User One",
  email: "testuserone@gmail.com",
  password: "testuserone",
};

const setupDatabase = async () => {
  await Doctor.deleteMany();
  const __testUser__ = new Doctor(testUserOne);
  await __testUser__.save();
};

module.exports = {
  testUserOneId,
  testUserOne,
  setupDatabase,
};
