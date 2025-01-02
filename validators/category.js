const joi = require("@hapi/joi");

const createCategoryValidator = joi
  .object({
    name: joi.string().required(),
    tenant_id: joi.number().required(),
  })
  .unknown();

const updateCategoryValidator = joi
  .object({
    id: joi.number().required(),
    name: joi.string().required(),
    tenant_id: joi.number().required(),
  })
  .unknown();

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
};
