const Joi = require("@hapi/joi");

const expensesSchema = Joi.object({
  type: Joi.string()
    .pattern(new RegExp("^(foods|treatment|transport|rent)$"))
    .required(),
});

module.exports = expensesSchema;
