const joi = require("joi");

// Sign Up Schema
const applicationSchema = joi.object({
  page: joi.string().optional(),
  limit: joi.string().optional(),
  user_id: joi.number().integer().optional(),
  query: joi.string().optional(),
  status: joi.string().optional()
});

// Create Applicaiton Schema
const applicationCreateSchema = joi.object({
  job_id: joi.number().integer().required(),
  full_name: joi.string().required(),  
  email: joi.string().required(),  
  mobile_number: joi.string().min(10).max(15).required(),  
  cover_letter: joi.string().required(),  
  resume: joi.string().required()  
})


const updateApplicaitonSchema = joi.object({
  application_id: joi.number().integer().required(),
  status: joi.string().required(),
})

module.exports = {
  applicationSchema,
  applicationCreateSchema,
  updateApplicaitonSchema
};
