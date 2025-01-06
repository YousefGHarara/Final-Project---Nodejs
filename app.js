const express = require("express");
const middleware = require("./Middlewares");
const router = require("./Routes");
const createError = require("http-errors");
const { jsonResponse } = require("./MyModule/Json_response");
global.jsonResponse = jsonResponse;

const app = express();

process.on("unhandledRejection", (reason) => {
  console.log(reason);
  process.exit(1);
});

middleware.global(app);
router(app);

app.use((req, res, next) => {
  return next(createError(404, "Page Not Found !!"));
});

// Error handler
app.use((err, req, res, next) => {
  return jsonResponse(res, err.statusCode, false, err.message, null);
});

module.exports = app;
