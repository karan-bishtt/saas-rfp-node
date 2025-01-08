const joi = require("@hapi/joi");
const { getMessage } = require("../lang");

const adminValidator = joi
  .object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().required(),
    firstname: joi.string().required(),
    lastname: joi.string(),
    mobile: joi
      .string()
      .length(10)
      .pattern(/^\d+$/) // Ensures only digits
      .required(),
    tenant_name: joi.string().required(),
  })
  .unknown();

const vendorValidator = joi
  .object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().required(),
    firstname: joi.string().required(),
    lastname: joi.string(),
    revenue: joi.number().greater(0).required(),
    no_of_employees: joi.number().greater(0).required(),
    category: joi.array().required(),
    pancard_no: joi
      .string()
      .length(10)
      .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/) // Pattern for valid PAN card numbers
      .required()
      .messages({
        "string.pattern.base": getMessage("auth.panCardInvalid"),
      }),
    gst_no: joi
      .string()
      .length(15)
      .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/) // Pattern for valid GST numbers
      .required()
      .messages({
        "string.length": getMessage("auth.gstCardInvalid"),
        "string.pattern.base": getMessage("auth.gstCardInvalid"),
      }),
    mobile: joi
      .string()
      .length(10)
      .pattern(/^\d+$/) // Ensures only digits
      .required(),
    tenant_id: joi.number().required(),
  })
  .unknown();

const accountantValidator = joi
  .object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().required(),
    firstname: joi.string().required(),
    lastname: joi.string(),
    mobile: joi
      .string()
      .length(10)
      .pattern(/^\d+$/) // Ensures only digits
      .required(),
    tenant_id: joi.number().required(),
    license_no: joi
      .string()
      .pattern(/^[A-Z0-9]{8,12}$/) // Example: 8-12 alphanumeric characters
      .required()
      .messages({
        "string.pattern.base": getMessage("accountant.licenseNoInvalid"),
      }),
  })
  .unknown();

const managerValidator = joi
  .object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().required(),
    firstname: joi.string().required(),
    lastname: joi.string(),
    mobile: joi
      .string()
      .length(10)
      .pattern(/^\d+$/) // Ensures only digits
      .required(),
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
