const express = require("express");

const router = express.Router();

const jwtAuth = require("../middlewares/jwt-auth");
const permAuth = require("../middlewares/permAuth");
const patientPerms = require("../middlewares/permissions/patient");
patientController = require("../controllers/patient");

router.get("/", jwtAuth, patientController.getPatients);
router.get(
  "/:id",
  jwtAuth,
  permAuth(patientPerms),
  patientController.getPatient
);
router.post("/", jwtAuth, patientController.createPatient);
router.put(
  "/:id",
  jwtAuth,
  permAuth(patientPerms),
  patientController.updatePatient
);
router.delete(
  "/:id",
  jwtAuth,
  permAuth(patientPerms),
  patientController.deletePatient
);

module.exports = router;
