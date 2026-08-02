const joi = require("joi");

// Sign Up Schema
const signUpSchema = joi.object({
  full_name: joi.string(),
  email: joi.string().email().required(),
  mobile_number: joi.string().required(),
  password: joi.string().required(),
  confirm_password: joi.string().required(),
  // valid(joi.ref("passowrd")).required(),
  job_role: joi.string().required(),
});

// Sign In
const signInSchema = joi
  .object({
    email: joi.string().email().optional(),
    password: joi.string().when("email", {
      is: joi.exist(),
      then: joi.required(),
      otherwise: joi.optional(),
    })
  })
  .or("email");

const changePasswordSchema = joi.object({
  current_password: joi.string().required(),
  new_password: joi.string().required(),
  confirm_password: joi.string().valid(joi.ref("new_password")).required(),
});

module.exports = {
  signUpSchema,
  signInSchema,
  changePasswordSchema};
