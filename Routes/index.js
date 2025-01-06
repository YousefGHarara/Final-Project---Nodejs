const authRouter = require("./auth");
const expensesRouter = require("./expneses");
const expenserRouter = require("./expenser");

module.exports = (app) => {
  app.get("/", (req, res, next) => {
    res.json({
      message: "Hello !",
    });
  });

  app.use("/auth", authRouter);

  app.use("/expenses", expensesRouter)

  app.use("/expenser", expenserRouter)
};
