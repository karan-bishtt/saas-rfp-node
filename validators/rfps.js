const Joi = require("@hapi/joi");
const { getMessage } = require("../lang");

const createRfpsValidator = Joi.object({
  item_name: Joi.string().required(),
  item_description: Joi.string().required(),
  quantity: Joi.number()
    .greater(0)
    .required()
    .messages({
      "number.greater": getMessage("rfps.quantityGreaterThanZero"),
      "any.required": getMessage("rfps.quantityRequired"),
    }),
  last_date: Joi.date().min("now").required(),
  minimum_price: Joi.number().required(),
  maximum_price: Joi.number()
    .required()
    .custom((value, helpers) => {
      const { minimum_price } = helpers.state.ancestors[0];
      if (minimum_price > value) {
        return helpers.message(
          getMessage("rfps.minimumPriceGreaterThanMaximumPrice")
        );
      }
      return value;
    })
    .messages({
      "any.required": getMessage("rfps.maximumPriceRequired"),
    }),
  vendors: Joi.array()
    .required()
    .custom((value, helpers) => {
      if (!value || value.length === 0) {
        return helpers.message(getMessage("rfps.vendorsRequired"));
      }
      return value;
    })
    .messages({
      "any.required": getMessage("rfps.vendorsRequired"),
    }),

  tenant_id: Joi.number().required(),
  category: Joi.number().required(),
}).unknown();

module.exports = {
  createRfpsValidator,
};
