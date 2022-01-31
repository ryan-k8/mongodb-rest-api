const express = require("express");

const router = express.Router();

const jwtAuth = require("../middlewares/jwt-auth");
const permAuth = require("../middlewares/permAuth");
const reportPerms = require("../middlewares/permissions/report");
const reportController = require("../controllers/report");

router.get("/", jwtAuth, reportController.getReports);
router.get("/:id", jwtAuth, permAuth(reportPerms), reportController.getReport);
router.post("/", jwtAuth, reportController.createReport);
router.put(
  "/:id",
  jwtAuth,
  permAuth(reportPerms),
  reportController.updateReport
);
router.delete(
  "/:id",
  jwtAuth,
  permAuth(reportPerms),
  reportController.deleteReport
);

module.exports = router;
