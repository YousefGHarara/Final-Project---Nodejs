const { Router } = require("express");
const { authController } = require("../Controller");

const router = Router();

router
  .post("/signup", authController.signup)
  .post("/login", authController.login);

module.exports = router;
