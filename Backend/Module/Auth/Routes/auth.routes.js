const express = require("express");
const router = express.Router();
const controller = require("../Controller/auth.controller");
const common = require("../../../Common/common");
const validator = require("../Validator/auth.validator");
const upload = require("../../../Common/Middleware/upload");
const { sendResponse, checkRole } = require("../../../Common/Middleware/middleware");
const { responseCode } = require("../../../Constant/constant");


// Sign Up
router.post(
  "/signUp",
  common.validate(validator.signUpSchema),
  controller.signUp,
);

// Sign In
router.post(
  "/signIn",
  common.validate(validator.signInSchema),
  controller.signIn,
);

// Logout
router.get("/logout", controller.logout);

// Update Password
router.patch(
  "/changePassword",
    checkRole(["admin", "user"]),
  common.validate(validator.changePasswordSchema),
  controller.changePassword,
);
module.exports = router;
