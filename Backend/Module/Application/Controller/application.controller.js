const validateJoi = require("../Validator/application.validator");
const common = require("../../../Common/common");
const { sendResponse } = require("../../../Common/Middleware/middleware");
const { responseCode, statusCode } = require("../../../Constant/constant");
const service = require("../Service/application.service");
const {upload} = require("../../../Common/Middleware/upload");

// Fetch all applications
const fetchApplications = async (req, res) => {
  try {
    console.log("req body", req.body)
    const result = await service.fetchApplications(req);
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
    } else if (!result.success) {
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

// Create Application
const createApplication = async (req, res) => {
  try {
    const result = await service.createApplication(req);
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

// Update Job
const updateApplication = async (req, res) => {
  try {
    const result = await service.updateApplication(req.body);
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

// add advertisement media
const applicationMediaUpload = async (req, res) => {
 try {
  // console.log('as')
        const file_type = req.body.file_type
        const fileArray = req.files?.file
 
        if (!file_type || !fileArray || !["cover_letter", "resume"].includes(file_type)) {
            return sendResponse(req, res, 400, 0, "REQIRED_FIELDS_MISSING", {})
        }
 
        const file = fileArray[0]
        const fs = require('fs')
        const path = require('path')
 
        // Determine directory based on purpose
        let uploadDir = file_type === "resume" ? "uploads/resume_documents/" : "uploads/cover_letter_documents/"
 
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }
 
        // Generate filename
        const filename = `${Date.now()}-${file.originalname}`
        const filePath = `${uploadDir}${filename}`
 
        // Write file to disk
        fs.writeFileSync(filePath, file.buffer)
 
        // Normalize path for response
        const normalizedPath = filePath.replace(/\\/g, "/")
 
        const mediaUrl = `${normalizedPath}`
        return sendResponse(req, res, 200, 1, "FILE_UPLOADED_SUCCESSFULLY", { filePath: mediaUrl })
    } catch (err) {
        console.log(err)
        return sendResponse(req, res, 500, 0, { keyword: "ERROR_DURING_ANY", components: { "resource": "Uploading Media" } }, {})
    }
};

module.exports = {
  fetchApplications,
  createApplication,
  updateApplication,
  applicationMediaUpload,
};
