const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const patientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "doctor",
    },
  },
  { timestamps: true }
);

const Patient = mongoose.model("patient", patientSchema);
module.exports = Patient;
