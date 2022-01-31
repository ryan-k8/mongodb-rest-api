const Patient = require("../../models/patient");

module.exports = async ({ uid, id }) => {
  try {
    const patient = await Patient.findById(id);

    if (patient.doctor.toString() !== uid.toString()) {
      return false;
    }

    return true;
  } catch (err) {
    console.log(err);
  }
};
