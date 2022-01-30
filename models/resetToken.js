const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const resetTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Doctor",
  },
  token: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 3600,
  },
});

resetTokenSchema.statics.verify = async function (token) {
  const result = await Token.findOne({ token: token });

  if (!result) {
    return false;
  } else {
    return true;
  }
};

const Token = mongoose.model("token", resetTokenSchema);
module.exports = Token;
