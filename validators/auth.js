const joi = require("@hapi/joi");

const adminValidator = joi
  .object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().required(),
    firstname: joi.string().required(),
    lastname: joi.string(),
    mobile: joi.string().length(10).required(),
    tenant_name: joi.string().required(),
  })
  .unknown();

const vendorValidator = joi
  .object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().required(),
    firstname: joi.string().required(),
    lastname: joi.string().required(),
    revenue: joi.number().required(),
    no_of_employees: joi.number().required(),
    category: joi.array().required(),
    pancard_no: joi.string().required(),
    gst_no: joi.string().required(),
    mobile: joi.string().required(),
    tenant_id: joi.number().required(),
  })
  .unknown();

const accountantValidator = joi
  .object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().required(),
    firstname: joi.string().required(),
    lastname: joi.string(),
    mobile: joi.string().required(),
    tenant_id: joi.number().required(),
    license_no: joi.string().required(),
  })
  .unknown();

const managerValidator = joi
  .object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().required(),
    firstname: joi.string().required(),
    lastname: joi.string(),
    mobile: joi.string().required(),
    tenant_id: joi.number().required(),
  })
  .unknown();

const resetPasswordValidator = joi
  .object({
    email: joi.string().email().lowercase().required(),
    old_password: joi.string().required(),
    new_password: joi.string().required(),
  })
  .unknown();

const confirmPasswordValidator = joi
  .object({
    new_password: joi.string().required(),
    email: joi.string().email().lowercase().required(),
    otp: joi.string().required(),
  })
  .unknown();

const loginValidator = joi.object({
  email: joi.string().email().lowercase().required(),
  password: joi.string().required(),
});

module.exports = {
  adminValidator,
  vendorValidator,
  accountantValidator,
  managerValidator,
  resetPasswordValidator,
  confirmPasswordValidator,
  loginValidator,
};
