const { ObjectId } = require("bson");
const { Expenses, Expenser } = require("../Model");
const createError = require("http-errors");
const { jsonResponse } = require("../MyModule/Json_response");
const { dateFormate, expenseData } = require("../Configurations");

const add = (req, res, next) => {
  const expensesData = req.body;

  const _expenser_id = new ObjectId(req._expenser_id);

  // validation
  const validation = Expenses.validate(expensesData);

  if (validation.error) {
    return next(createError(500, validation.error.message));
  }

  const expenseValue = expenseData.filter((value) => {
    return value.type === expensesData.type;
  });

  // validate is a expense is enigth or not
  Expenser.getRemainingOf(_expenser_id).then((result) => {
    if (!result.status) {
      return next(createError(500, result.message));
    }

    const total = result.data - expenseValue[0].value;

    if (total < 0) {
      return next(createError(500, "Your balance isn't enough"));
    }

    const expense = new Expenses({
      ...expensesData,
      _expenser_id: _expenser_id,
      value: expenseValue[0].value,
      date: dateFormate,
    });

    expense.save((result) => {
      if (!result.status) {
        return next(createError(500, result.message));
      }

      return jsonResponse(
        res,
        200,
        true,
        "Expnese had been created !!",
        expense
      );
    });
  });
};

const getAll = (req, res, next) => {
  const _expenser_id = new ObjectId(req._expenser_id);

  Expenses.getAllById(_expenser_id, (result) => {
    if (!result.status) {
      return next(createError(500, result.message));
    } else {
      return jsonResponse(res, 200, true, "", result.data);
    }
  });
};

module.exports = {
  add,
  getAll,
};
