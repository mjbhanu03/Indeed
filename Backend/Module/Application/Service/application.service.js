const common = require("../../../Common/common");
const repository = require("../Repository/application.repository");
const middleware = require("../../../Common/Middleware/middleware");
const constant = require("../../../Constant/constant");
const bcrypt = require("bcryptjs");
const { checkToken } = require("../../Auth/Repository/auth.repository");
const jwt = require("jsonwebtoken");


// Fetch Applications
const fetchApplications = async (req) => {
  try {
    let result;
    if (req.user?.role === "user")
      result = await repository.fetchApplications(req.body, req.user.user_id);
    
    else result = await repository.fetchApplications(req.body);
    if (!result.success) return { success: false, key: result.key };
    // console.log("service eresult", result)
    return { success: true, key: "dataFound", data: result.obj };
  } catch (error) {
    console.log(error);
    return { success: false, key: "somethingWentWrong" };
  }
};

// Create Application
const createApplication = async (req) => {
  try {
    const result = await repository.createApplication(
      req.body,
      req.user.user_id,
    );
    if (!result.success) return { success: false, key: result.key };
    return { success: true, key: "jobCreated", data: result.data };
  } catch (error) {
    console.log(error);
    return { success: false, key: "somethingWentWrong" };
  }
};

// Update Applicaiton
const updateApplication = async (req) => {
  try {
    const result = await repository.updateApplication(req);
    if (!result.success) return { success: false, key: result.key };
    return { success: true, key: "jobUpdated", data: result.data };
  } catch (error) {
    console.log(error);
    return { success: false, key: "somethingWentWrong" };
  }
};

module.exports = {
  fetchApplications,
  createApplication,
  updateApplication,
};
