const Joi = require("@hapi/joi")

const loginSchema = Joi.object({
  username: Joi.string().min(4).max(12).required(),
  password: Joi.string()
    .pattern(new RegExp(""))
    .message("error in pattern")
    .required(),
});

module.exports = loginSchema;