const joi = require("@hapi/joi");

const approveUserStatusValidator = joi
  .object({
    user_id: joi.number().required(),
    status: joi.string().valid("Approved", "Pending", "Rejected").required(),
    tenant_id: joi.number().required(),
  })
  .unknown();

const approveAdminStatusValidator = joi
  .object({
    user_id: joi.number().required(),
    status: joi.string().valid("Approved", "Pending", "Rejected").required(),
  })
  .unknown();

module.exports = {
  approveUserStatusValidator,
  approveAdminStatusValidator,
};
