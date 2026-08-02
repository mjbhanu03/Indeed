const validateJoi = require("../Validator/admin.validator");
const common = require("../../../Common/common");
const { sendResponse } = require("../../../Common/Middleware/middleware");
const { responseCode, statusCode } = require("../../../Constant/constant");
const service = require("../Service/admin.service");
const upload = require("../../../Common/Middleware/upload");

// Fetch Users
const fetchUsers = async (req, res) => {
  try {
    const result = await service.fetchUsers(req);
    if (!result.success && result.key === "noDataFound") {
      sendResponse(
        req,
        res,
        statusCode.SUCESS,
        responseCode.NO_DATA_FOUND,
        { key: result.key },
        result.errors,
      );
      return;
    } else if (!result.success && result.key === "somethingWentWrong") {
      sendResponse(
        req,
        res,
        statusCode.SUCESS,
        responseCode.ERROR,
        { key: result.key },
        result.errors,
      );
      return;
    } else {
      sendResponse(
        req,
        res,
        statusCode.SUCESS,
        responseCode.SUCCESS,
        { key: result.key },
        result.data,
      );
      return;
    }
  } catch (error) {
    console.log(error);
    sendResponse(
      req,
      res,
      501,
      responseCode.ERROR,
      { key: "internalServerError" },
      {},
    );
  }
};

// Update User Active Status
const updateUserActiveStatus = async (req, res) => {
  try {
    const result = await service.updateUserActiveStatus(req.body);
    if (!result.success && result.key === "somethingWentWrong") {
      sendResponse(
        req,
        res,
        statusCode.SUCESS,
        responseCode.ERROR,
        { key: result.key },
        result.errors,
      );
      return;
    } else {
      sendResponse(
        req,
        res,
        statusCode.SUCESS,
        responseCode.SUCCESS,
        { key: result.key },
        result.data,
      );
      return;
    }
  } catch (error) {
    console.log(error);
    sendResponse(
      req,
      res,
      501,
      responseCode.ERROR,
      { key: "internalServerError" },
      {},
    );
  }
};

// Dashboard
const fetchDashboard = async (req, res) => {
  try {
    const result = await service.dashboard();
    if (!result.success && result.key === "noDataFound") {
      sendResponse(
        req,
        res,
        statusCode.SUCESS,
        responseCode.NO_DATA_FOUND,
        { key: result.key },
        result.errors,
      );
      return;
    } else if (!result.success && result.key === "somethingWentWrong") {
      sendResponse(
        req,
        res,
        statusCode.SUCESS,
        responseCode.ERROR,
        { key: result.key },
        result.errors,
      );
      return;
    } else {
      sendResponse(
        req,
        res,
        statusCode.SUCESS,
        responseCode.SUCCESS,
        { key: result.key },
        result.data,
      );
      return;
    }
  } catch (error) {
    console.log(error);
    sendResponse(
      req,
      res,
      501,
      responseCode.ERROR,
      { key: "internalServerError" },
      {},
    );
  }
};

// Skills
const fetchSkills = async (req, res) => {
  try {
    const result = await service.fetchSkills();
    if (!result.success && result.key === "noDataFound") {
      sendResponse(
        req,
        res,
        statusCode.SUCESS,
        responseCode.NO_DATA_FOUND,
        { key: result.key },
        result.errors,
      );
      return;
    } else if (!result.success && result.key === "somethingWentWrong") {
      sendResponse(
        req,
        res,
        statusCode.SUCESS,
        responseCode.ERROR,
        { key: result.key },
        result.errors,
      );
      return;
    } else {
      sendResponse(
        req,
        res,
        statusCode.SUCESS,
        responseCode.SUCCESS,
        { key: result.key },
        result.data,
      );
      return;
    }
  } catch (error) {
    console.log(error);
    sendResponse(
      req,
      res,
      501,
      responseCode.ERROR,
      { key: "internalServerError" }, 
      {},
    );
  }
}
module.exports = {
  fetchUsers,
  updateUserActiveStatus,
  fetchDashboard,
  fetchSkills
};
