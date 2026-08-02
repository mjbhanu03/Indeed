const validateJoi = require("../Validator/job.validator");
const common = require("../../../Common/common");
const { sendResponse } = require("../../../Common/Middleware/middleware");
const { responseCode, statusCode } = require("../../../Constant/constant");
const service = require("../Service/job.service");
const upload = require("../../../Common/Middleware/upload");

// Fetch all jobs
const fetchJobs = async (req, res) => {
  try {
    // console.log(req.user.user_id)
    const result = await service.fetchJobs(req.body, req.user?.user_id);

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
    }  else if (!result.success && result.key === "somethingWentWrong") {
      sendResponse(
        req,
        res,
        statusCode.SUCESS,
        responseCode.ERROR,
        { key: result.key },
        result.errors,
      );
      return;
    }else {
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

// Fetch job details
const fetchJobDetails = async (req, res) => {
  try {
    const result = await service.fetchJobDetails(req.params.id, req);
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
    }  else if (!result.success && result.key === "somethingWentWrong") {
      sendResponse(
        req,
        res,
        statusCode.SUCESS,
        responseCode.ERROR,
        { key: result.key },
        result.errors,
      );
      return;
    }else {
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

// Create Job 
const createJob = async (req, res) => {
  try {
    const result = await service.createJob(req.body);
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
    }else {
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

// Update Job
const updateJob = async (req, res) => {
  try {
    const result = await service.updateJob(req.body);
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
    }else {
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

// Delete Job
const deleteJob = async (req, res) => {
  try {
    const result = await service.deleteJob(req.body.job_id);
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
    }else {
      sendResponse(
        req,
        res,
        statusCode.SUCESS,
        responseCode.SUCCESS,
        { key: result.key },
        result.data,
      );
  } 
}catch (error) {
    console.log(object)
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
  fetchJobs,
  fetchJobDetails,
  createJob,
  updateJob,
  deleteJob
};
