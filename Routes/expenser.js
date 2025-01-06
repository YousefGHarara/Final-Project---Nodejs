const { Router } = require("express");
const auth = require("../Middlewares/auth");
const { expenserController } = require("../Controller");

const router = Router();

router.post("/addTotal", auth, expenserController.addTotalExpens)
.get("/getAllExpense", auth, expenserController.getAllExpense)
.get("/getRemainingOf", auth, expenserController.getRemainingOf)
.get("/getAvgDaily", auth, expenserController.getAvgDaily);

module.exports = router;
