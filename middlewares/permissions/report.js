const Report = require("../../models/report");
const { objectIdSchema } = require("../../models/validation/schema");
const { ExpressError } = require("../../util/err");

module.exports = async ({ uid, id }) => {
  try {
    const resultId = await objectIdSchema.validateAsync(id);

    const report = await Report.findById(resultId);

    if (!report) {
      return [new ExpressError("no report found", 404), null];
    }

    if (report.doctor.toString() !== uid.toString()) {
      return [null, false];
    }

    return [null, true];
  } catch (err) {
    return [err, null];
  }
};
