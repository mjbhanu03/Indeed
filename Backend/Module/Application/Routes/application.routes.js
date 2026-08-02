const express = require("express");
const router = express.Router();
const controller = require("../Controller/application.controller");
const common = require("../../../Common/common");
const validator = require("../Validator/application.validator");
const {upload} = require("../../../Common/Middleware/upload");
const {
  sendResponse,
  checkRole,
} = require("../../../Common/Middleware/middleware");
const { responseCode } = require("../../../Constant/constant");

// Fetch all jobs
router.post(
  "/fetchApplications",
  common.validate(validator.applicationSchema, true),
  controller.fetchApplications,
);

// Create applicaiton
router.post(
  "/createApplication",
  common.validate(validator.applicationCreateSchema),
  controller.createApplication,
);

// Update job
router.patch(
  "/updateApplication",
  checkRole(["admin"]),
  common.validate(validator.updateApplicaitonSchema),
  controller.updateApplication,
);

// add advertisement media
router.post("/media/upload", upload, controller.applicationMediaUpload)
 
// router.post("/media/upload", controller.applicationMediaUpload);
module.exports = router;
