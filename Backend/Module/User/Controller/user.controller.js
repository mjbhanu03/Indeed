const service = require("../Service/user.service");
const validator = require("../Validator/user.validator");
const {responseCode} = require("../../../Constant/constant");
const common = require("../../../Common/common");
const { sendResponse } = require("../../../Common/Middleware/middleware");
const env = require("dotenv").config();
const {responseCode: constants} = require("../../../Constant/constant")

// Fetch Dashboard
const fetchDashboard = async (req, res) => {
  try {
    const response = await service.fetchDashboard(req.user.user_id);
    if (!response.success)
      sendResponse(req, res, 400, responseCode.ERROR, { key: response.key }, {});
    else
      sendResponse(
        req,
        res,
        200,
        responseCode.SUCCESS,
        { key: "userDataFetched" },
        response.data,
      );
  } catch (error) {
    console.log(error);
    sendResponse(
      req,
      res,
      400,
      responseCode.ERROR,
      { key: "somethingWentWrong" },
      {},
    );
  }
}

// Fetch Profie
const fetchProfile = async (req, res) =>{
  try {
    const response = await service.fetchProfile(req.user.user_id);
    if (!response.success)
      sendResponse(req, res, 400, responseCode.ERROR, { key: response.key }, {});
    else
      sendResponse(
        req,
        res,
        200,
        responseCode.SUCCESS,
        { key: "userDataFetched" },
        response.data,
      );
  } catch (error) {
    console.log(error);
    sendResponse(
      req,
      res,
      400,
      responseCode.ERROR,
      { key: "somethingWentWrong" },
      {},
    );
}}

// Update profile
const updateProfile = async (req, res) => {
  try {
    const profile = await service.updateProfile({
      ...req.body,
      user_id: req.user.user_id,
    });

    if (profile.key === "invalidProfileData")
      sendResponse(
        req,
        res,
        200,
        constants.NO_DATA_FOUND,
        { key: "invalidProfileData" },
        {},
      );
    else if (!profile.success)
      sendResponse(req, res, 400, constants.ERROR, { key: profile.key }, {});
    else
      sendResponse(
        req,
        res,
        200,
        constants.SUCCESS,
        { key: "profileUpdated" },
        profile.user,
      );
  } catch (error) {
    console.log(error);
    sendResponse(
      req,
      res,
      400,
      constants.ERROR,
      { key: "somethingWentWrong" },
      {},
    );
  }
};

// Chat With AI
const chatWithAI = async (req, res)=>{
  try {
    const response = await service.chatWithAI({...req.body, user_id: req.user.user_id})
    console.log("Here is the error", response)
    sendResponse(req, res, 200, constants.SUCCESS, "Success", response)
  } catch (error) {
    console.log(error)  
    sendResponse(req, res, 400, constants.ERROR, {key: "somethingWentWrong"}, {})
  }

}
module.exports = {
  fetchProfile,
  updateProfile,
  fetchDashboard,
  chatWithAI
};
