const createError = require("http-errors");
const { readFileSync } = require("fs");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return next(createError(401));
  }

  const token = authHeader.split(" ")[1];

  const secretKey = readFileSync("./Configurations/private.key");

  const decode = jwt.verify(token, secretKey);

  try {
    req._expenser_id = decode._expenser_id;
    next();
  } catch (err) {
    return next(createError(400, err.message));
  }
};
