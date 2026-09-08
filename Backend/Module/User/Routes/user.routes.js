const express = require("express");

const controller = require("../Controller/user.controller");
const common = require("../../../Common/common");
const validator = require("../Validator/user.validator");
const { decryption } = require("../../../Common/Middleware/middleware");

const router = express.Router();

// dashboard
router.get("/dashboard", controller.fetchDashboard);

// Update profile
router.put(
  "/profile",
  common.validate(validator.updateProfileSchema),
  controller.updateProfile,
);

//Chat with Ai 
router.post("/ai-chat", controller.chatWithAI)

// get profile
router.get(
  "/profile",
  controller.fetchProfile,
);

module.exports = router;
