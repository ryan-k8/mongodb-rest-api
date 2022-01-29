const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reportSchema = new Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "patient",
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "doctor",
    },

    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("report", reportSchema);
module.exports = Report;
