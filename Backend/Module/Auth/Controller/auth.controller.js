const validateJoi = require("../Validator/auth.validator");
const common = require("../../../Common/common");
const { sendResponse } = require("../../../Common/Middleware/middleware");
const {responseCode, statusCode} = require("../../../Constant/constant");
const service = require("../Service/auth.service");
const upload = require("../../../Common/Middleware/upload");

// Sign Up
const signUp = async (req, res) => {
  console.log("signup controller")
  try {
    console.log("as", req.body)
    const result = await service.signUp(req.body);

    if (!result.success) {
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
        result.user,
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


// Sign In
const signIn = async (req, res) => {
  try {
    const result = await service.signIn(req.body);
    if (!result.success) {
      sendResponse(
        req,
        res,
        statusCode.SUCESS,
        result.code,
        { key: result.key },
        result.errors,
      );
      return;
    } else {
      sendResponse(
        req,
        res,
        statusCode.SUCESS,
        result.code,
        { key: result.key },
        result.user,
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

// Logout
const logout = async (req, res) => {
  try {
    const result = await service.logout(req.headers.token, req.user.user_id);
    if (!result.success) {
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
        {},
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

// Update Password
const changePassword = async (req, res) => {
  try {
    const result = await service.changePassword(req.body, req.user);
    if (!result.success) {
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
        {},
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

module.exports = {
  signUp,
  signIn,
  logout,
  changePassword,
};
