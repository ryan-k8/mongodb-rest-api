const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth");
const upload = require("../middlewares/upload");

router.post("/register", upload.single("image"), authController.register);
router.post("/login", authController.login);
router.delete("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.post("/reset-password/", authController.resetPassword);
router.post(
  "/reset-password/:userId/:token",
  authController.verifyAndResetPassword
);

module.exports = router;
