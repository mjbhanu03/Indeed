const joi = require("joi");
const userListingSchema = joi.object({
  query: joi.string().optional(),
  status: joi.string().optional(),
  page: joi.string().optional(),
  limit: joi.string().optional(),
})

const updateUserActiveStatusSchema = joi.object({
  user_id: joi.number().integer().required(),
  is_active: joi.number().required(),
})

module.exports = {
  userListingSchema,
  updateUserActiveStatusSchema
};
