const Joi = require("@hapi/joi");

const expenserSchema = Joi.object({
  total_expense: Joi.number().positive().min(100).required(),
});

module.exports = expenserSchema;
