const responseCode = {
  API_ERROR: -1,
  ERROR: 0,
  SUCCESS: 1,
  VALIDATION_ERROR: 2,
  NO_DATA_FOUND: 3,
  PROFILE_PICTURE_PENDING: 4,
  ADDRESS_PENDING: 5
}
const statusCode = {
  SUCESS: 200,
  AUTHENTICATION_ERROR: 401,
  INTERNAL_SERVER_ERROR: 500
}
const from_email = "jaymange263@gmail.com"

module.exports = { responseCode, from_email, statusCode }