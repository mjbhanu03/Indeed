const {responseCode: constant} = require("../Constant/constant");
const { sendResponse } = require("./Middleware/middleware");
const jwt = require("jsonwebtoken");
const localizify = require("localizify");
const { t } = require("localizify");
const en = require("../Languages/en");

const env = require("dotenv");
env.config();
const common = {
  // Create Token
  jwt_sign: (data, expiresIn = "7d") => {
    try {
      const token = jwt.sign(data, process.env.JWT_WEB_TOKEN, { expiresIn });
      return { success: true, key: "tokenGenerated", token: token };
    } catch (error) {
      console.log(error);
      return { success: false, key: "tokenGenerationFailed" };
    }
  },

  // Generate Token
  generateToken: (data) => {
    try {
      let userDetails = {
        user_id: data.user_id,
        email: data.email,
        role: data.role
      };

      const token = common.jwt_sign(userDetails, "1d");

      return { success: true, key: "tokenGenerated", token: token.token };
    } catch (error) {
      console.log(error);
      return { success: false, key: "tokenGenerationFailed" };
    }
  },

  validate: (schema, allowEmptyTrue = false) => {
    if(allowEmptyTrue) return (req, res, next) => next();
    return (req, res, next) => {
      // console.log("schema here", req.body)
      if (!req.body) {
        sendResponse(
          req,
          res,
          401,
          constant.ERROR,
          { key: "bodyMissing" },
          {},
        );
        return;
      }
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        const errors = error
        ? Object.fromEntries(
          error.details.map((err) => [err.path[0], err.message]),
            )
            : {};
            return res.status(200).send({
              code: constant.VALIDATION_ERROR,
              message: "validationFailed",
              errors: errors,
            });
          } else {
            next();
          }
    };
  },

  sendEmail: async (to_email, subject, message) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    var mailOptions = {
      from: constant.from_email,
      to: to_email,
      subject: subject,
      html: message,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return { success: true, message: "emailSentSuccess", data: info };
    } catch (error) {
      console.log(error);
      return { success: false, message: "failToSendEmail", data: error };
    }
  },
};
module.exports = common;
