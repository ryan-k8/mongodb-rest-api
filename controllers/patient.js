const Patient = require("../models/patient");
const { patientSchema } = require("../models/validation/schema");

exports.getPatients = async (req, res, next) => {
  try {
    const { uid } = req.user;
    let { page, limit } = req.query;

    page = page || 1;
    limit = limit || Number.MAX_SAFE_INTEGER;

    const noOfpatients = await Patient.find({ doctor: uid })
      .skip((page - 1) * limit)
      .limit(limit)
      .countDocuments();

    const patients = await Patient.find({ doctor: uid })
      .skip((page - 1) * limit)
      .limit(limit);

    if (page !== 1 && limit !== Number.MAX_SAFE_INTEGER) {
      res.status(200).json({
        page: page,
        perPage: limit,
        results: {
          count: noOfpatients,
          data: patients,
        },
      });
    }

    res.status(200).json({
      total: noOfpatients,
      results: patients,
    });
  } catch (err) {
    next(err);
  }
};

exports.getPatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);

    res.status(200).json(patient);
  } catch (err) {
    next(err);
  }
};
exports.createPatient = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const result = await patientSchema.validateAsync({
      name: req.body.name,
      doctor: uid,
    });

    await Patient.create({
      name: result.name,
      doctor: result.doctor,
    });

    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};
exports.updatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await patientSchema.validateAsync(req.body);

    const patient = await Patient.findById(id);
    patient.name = result.name;
    patient.doctor = result.doctor;

    await patient.save();
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
exports.deletePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Patient.findByIdAndDelete(id);

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
