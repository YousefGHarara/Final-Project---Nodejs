const { Router } = require("express");
const { auth } = require("../Middlewares");
const { expensesController } = require("../Controller");

const router = Router();

router
  .post("/add", auth, expensesController.add)
  .get("/getAll", auth, expensesController.getAll);

module.exports = router;
