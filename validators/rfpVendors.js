const joi = require("@hapi/joi");

const applyRfpValidator = joi
  .object({
    item_price: joi.number().greater(0).required(),
    total_cost: joi.number().greater(0).required(),
    rfp_id: joi.number().required(),
    tenant_id: joi.number().required(),
  })
  .unknown();

module.exports = {
  applyRfpValidator,
};
