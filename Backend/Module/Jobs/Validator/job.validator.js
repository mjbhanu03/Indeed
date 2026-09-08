const joi = require("joi");

// Sign Up Schema
const jobListingSchema = joi.object({
  search: joi.string().optional(),
  status: joi.string().optional(),
  sort: joi.string().optional(),
  page: joi.string().optional(),
  limit: joi.string().optional(),
  job_type: joi.string().optional(),
  location: joi.string().optional(),
  min_salary: joi.string().optional(),
  max_salary: joi.string().optional(),
});

const jobSchema = joi.object({
  job_title: joi.string().required(),
  company_name: joi.string().required(),
  description: joi.string().required(),
  job_type: joi.string().required(),
  location: joi.string().required(),
  salary: joi.number().required(),
  experience: joi.string().required(),
  skills: joi.array().items(joi.number()).min(1).required()
});

const updateJobSchema = joi.object({
  job_id: joi.number().integer().required(),
  job_title: joi.string().optional(),
  company_name: joi.string().optional(),
  description: joi.string().optional(),
  job_type: joi.string().optional(),
  location: joi.string().optional(),
  salary: joi.number().optional(),
  experience: joi.string().optional(),
  skills: joi.array().items(joi.number()).min(1).optional()
});

deleteJobSchema = joi.object({
  job_id: joi.number().integer().required(),
});

module.exports = {
  jobListingSchema,
  jobSchema,
  updateJobSchema,
  deleteJobSchema
};
