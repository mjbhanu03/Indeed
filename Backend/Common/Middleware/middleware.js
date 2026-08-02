const {responseCode} = require("../../Constant/constant");
const jwt = require("jsonwebtoken");
const { default: localizify } = require("localizify");
const { t } = require("localizify");
const en = require("../../Languages/en");
const env = require("dotenv");
const CryptoJS = require("crypto-js");
const key = process.env.KEY
const iv = process.env.IV

env.config();
// const constant = require('./Constant/constant')
const repository = require("../../Module/Auth/Repository/auth.repository");

const bypassRoutes = [
  "/auth/v1",
  "/auth/v1/generateOtp",
  "/auth/v1/validateOtp",
  "/auth/v1/signUp",
  "/auth/v1/signIn",
  "/auth/v1/checkCredential",
  "/auth/v1/forgotPassword",
  "/auth/v1/updatePassword",
  "/jobs/v1/fetchJobs"
];

// Check Token
const checkToken = async (req, res, next) => {
  try {
    if ((bypassRoutes.includes(req.path) && !req.headers.token)||   req.path.startsWith("/jobs/v1/fetchJobDetails/")) {
      return next();
    }

    const token = req.headers.token;
    const isTokenLoggedOut = await repository.checkToken(token);
    if (!token)
      return res
        .status(401)
        .send({ code: responseCode.ERROR, message: "tokenMissing", data: {} });

    const decoded = jwt.verify(token, process.env.JWT_WEB_TOKEN);

    if (!decoded)
      return res
        .status(401)
        .send({ code: responseCode.ERROR, message: "tokenExpired", data: {} });
    if (!isTokenLoggedOut)
      return res
        .status(401)
        .send({ code: responseCode.ERROR, message: "invalidToken", data: {} });

        // console.log("da", decoded)
    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
    sendResponse(
      req,
      res,
      401,
      responseCode.ERROR,
      { key: "tokenMissing" },
      {},
    );
  }
};

// Get Message
const getMessage = (requestLanguage = "en", key = "failed", value) => {
  try {
    // console.log(requestLanguage, key, value)
    localizify.add("en", en).setLocale(requestLanguage);

    let message = t(key, value);

    return message;
  } catch (error) {
    console.log(error);
    return "somethingWentWrong";
  }
};

const checkRole = (roles)=>{
  return(req, res, next)=>{

  try {
    // console.log(req.user)
    if(roles.includes(req.user.role)){
      next()
    } else{
        sendResponse(
      req,
      res,
      401,
      responseCode.ERROR,
      { key: "unauthorisedAccess" },
      {},
    );
    }
  } catch (error) {
    console.log(error)
    sendResponse(
      req,
      res,
      401,
      responseCode.ERROR,
      { key: "somethingWentWrong" },
      {},
    );
  }
  }

}

// Send Response
const sendResponse = async (
  req,
  res,
  statuscode,
  response_code,
  { key = "failed", component = {} },
  data = {},
) => {
  const message = await getMessage(
    "en",
    key,
    component,
  );
  // console.log('me khiladi', response_code)
  let response = { code: response_code, message: message, data: data };
  const encryptedData = encryption(response)

  return res.status(200).send(encryptedData);
};

// Check API Key
const checkAPIKey = (req, res, next) => {

  const apiKey = req.headers["api-key"];

  if (process.env.API_KEY !== apiKey) {
    sendResponse(req, res, 401, 2, { key: "apiKeyMissing" }, {});
  } else {
    next();
  }
};


const encryption = (req) => {
    // Implement your encryption logic here
    try {
        const key = CryptoJS.enc.Utf8.parse(process.env.KEY || "");
        const iv = CryptoJS.enc.Utf8.parse(process.env.IV || "");

        if (!process.env.KEY || !process.env.IV) {
            throw new Error("Missing KEY or IV in environment variables");
        }

        if(typeof req === 'object') {
            req = JSON.stringify(req);
        }
        const encryptedData = CryptoJS.AES.encrypt(req, key, {
            iv: iv,
          }).toString();
        return encryptedData;
    } catch (error) {
        console.log("Error in encryption: ", error);
        throw new Error("Encryption failed");
    }
}


const decryption = (req, res, next) => {
  if(req.path.startsWith('/applications/v1/media/upload')) return next()
    // console.log("kem aaya", req.body)
    if(!req.body) return next()
      if (req.body && Object.keys(req.body).length !== 0) {
        let encryptedBody = "";
        
        if (typeof req.body === "string") {
          encryptedBody = req.body;
        } else if (typeof req.body.data === "string") {
          encryptedBody = req.body.data;
        } else if (typeof req.body.payload === "string") {
          encryptedBody = req.body.payload;
        } else {
          // Request body is plain JSON, so skip AES decryption.
          return next();
        }
        
        const decryptedData = CryptoJS.AES.decrypt(
          encryptedBody,
          CryptoJS.enc.Utf8.parse(key),
          { iv: CryptoJS.enc.Utf8.parse(iv) },
        ).toString(CryptoJS.enc.Utf8);
        // console.log("object dec", decryptedData)
        let decryptionSend;
        try {
          if(decryptedData){
            decryptionSend = JSON.parse(decryptedData);
          }else{
            decryptionSend = decryptedData
          }
          // console.log("asdaf", typeof decryptionSend)
    } catch (error) {
      console.log("Error parsing decrypted data:", error);
      return sendResponse(
        req,
        res,
                500,
                0,
                "rest_keywords_error",
        {},
      );
    }
 
    req.body = decryptionSend;
    return next();
  }
 
  return next();
};


// const encryption = (responseData) => {
//   try {
//     if (responseData && Object.keys(responseData).length > 0) {
//       return cryptoLib.encrypt(
//         JSON.stringify(responseData),
//         shaKey,
//         process.env.IV,
//       );
//     }
//   } catch (error) {
//     console.log(error);
//     return responseData;
//   }
// };

// const decryption = (req, res, next) => {
//   try {
//     // console.log(req.body)
//     if (req.body && req.body.length > 0) {
//       req.body = JSON.parse(
//         cryptoLib.decrypt(req.body, shaKey, process.env.IV),
//       );
//       next();
//     } else {
//       next();
//     }
//   } catch (error) {
//     console.log(error);
//     return sendResponse(req, res, 200, 0, "Bad Decryption", {});
//   }
// };



module.exports = {
  sendResponse,
  checkToken,
  checkAPIKey,
  encryption,
  decryption,
  checkRole
};
