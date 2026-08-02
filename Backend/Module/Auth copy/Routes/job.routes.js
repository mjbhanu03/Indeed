const express = require("express");
const router = express.Router();
const controller = require("../Controller/job.controller");
const common = require("../../../Common/common");
const validator = require("../Validator/job.validator");
const upload = require("../../../Common/Middleware/upload");
const {
  sendResponse,
  checkRole,
} = require("../../../Common/Middleware/middleware");
const { responseCode } = require("../../../Constant/constant");

// Fetch all jobs
router.post(
  "/fetchJobs",
  common.validate(validator.jobListingSchema, true),
  controller.fetchJobs,
);

// Fetch job details
router.get("/fetchJobDetails/:id", controller.fetchJobDetails);

// Create job
router.post(
  "/createJob",
  checkRole(["admin"]),
  common.validate(validator.jobSchema),
  controller.createJob,
);

// Update job
router.patch(
  "/updateJob",
  checkRole(["admin"]),
  common.validate(validator.updateJobSchema),
  controller.updateJob,
);

// Delete Job
router.delete("/deleteJob", checkRole(["admin"]), common.validate(validator.deleteJobSchema), controller.deleteJob);

module.exports = router;
