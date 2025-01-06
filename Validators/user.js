const Joi = require("@hapi/joi");

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  username: Joi.string().min(4).max(12).required(),
  password: Joi.string()
    .pattern(new RegExp(""))
    .message("error in pattern")
    .required(),
});


module.exports = schema
