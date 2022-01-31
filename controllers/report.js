const { reportSchema, doctorSchema } = require("../models/validation/schema");
const Report = require("../models/report");
const Patient = require("../models/patient");
const { ExpressError } = require("../util/err");

exports.getReports = async (req, res, next) => {
  try {
    const { uid } = req.user;
    let { status, patient } = req.query;

    if (status && patient) {
      const reports = await Report.find({ doctor: uid }).and([
        { patient: patient },
        { status: status },
      ]);
      return res.status(200).json({
        total: reports.length,
        reports: reports,
      });
    }

    if (patient || status) {
      const reports = await Report.find({ doctor: uid }).or([
        { patient: patient },
        { status: status },
      ]);

      return res.status(200).json({
        total: reports.length,
        reports: reports,
      });
    }

    const reports = await Report.find({ doctor: uid });
    return res.status(200).json({
      total: reports.length,
      reports: reports,
    });
  } catch (err) {
    next(err);
  }
};

exports.getReport = async (req, res, next) => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id);

    res.status(200).json(report);
  } catch (err) {
    next(err);
  }
};

exports.createReport = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { patientId, status } = req.body;
    const patient = await Patient.findById(patientId);

    if (!patient) {
      throw new ExpressError("no such patient exists", 400);
    }

    if (patient.doctor.toString() !== uid) {
      throw new ExpressError("forbidden", 403);
    }
    const result = await reportSchema.validateAsync({
      patient: patientId,
      doctor: uid,
      status: status.toLowerCase(),
    });

    await Report.create(result);

    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};

exports.updateReport = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;
    const { status, patientId } = req.body;

    const result = await reportSchema.validateAsync({
      patient: patientId,
      doctor: uid,
      status: status,
    });

    const report = await Report.findById(id);

    report.status = result.status;
    await report.save();

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

exports.deleteReport = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Report.findByIdAndDelete(id);

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
