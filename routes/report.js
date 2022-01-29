const express = require("express");

const router = express.Router();

router.get("/", reportController.getReports);
router.get("/:id", reportController.getReport);
router.post("/", reportController.createReport);
router.put("/:id", reportController.updateReport);
router.delete("/:id", reportController.deleteReport);

module.exports = router;
