const express = require("express");
const router = express.Router();
const controller = require("../Controller/admin.controller");
const common = require("../../../Common/common");
const validator = require("../Validator/admin.validator");
const upload = require("../../../Common/Middleware/upload");
const {
  sendResponse,
  checkRole,
} = require("../../../Common/Middleware/middleware");
const { responseCode } = require("../../../Constant/constant");

// Fetch all users
router.post(
  "/fetchUsers",
  checkRole(["admin"]),
  common.validate(validator.userListingSchema, true),
  controller.fetchUsers,
);

// Fetch user details
router.get(
  "/fetchUsers/:id",
  checkRole(["admin"]),
  controller.fetchUsers,
);

// Update user
router.patch(
  "/updateUserActiveStatus",
  checkRole(["admin"]),
  common.validate(validator.updateUserActiveStatusSchema),
  controller.updateUserActiveStatus,
);

// Dashboard
router.get("/dashboard", checkRole(["admin"]), controller.fetchDashboard);
router.get("/skills",  controller.fetchSkills);  
module.exports = router;
