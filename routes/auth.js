const express = require("express");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refesh-token", authController.refreshToken);
router.post("/logout", authController.logout);

module.exports = router;
