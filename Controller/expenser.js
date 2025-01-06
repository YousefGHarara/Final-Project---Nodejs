const createError = require("http-errors");
const { Expenser } = require("../Model");
const { ObjectId } = require("bson");
const { jsonResponse } = require("../MyModule/Json_response");

const addTotalExpens = (req, res, next) => {
  const data = req.body;
  const validation = Expenser.validate(data);

  if (validation.error) {
    return next(createError(501, validation.error.message));
  }

  data._expenser_id = new ObjectId(req._expenser_id);

  Expenser.addTotalExpens(data, (result) => {
    if (!result.status) {
      return next(createError(500, result.message));
    } else {
      return jsonResponse(res, 201, true, "Add Whole had been created !", data);
    }
  });
};

const getAllExpense = (req, res, next) => {
  const _expenser_id = new ObjectId(req._expenser_id);

  Expenser.getAllExpense(_expenser_id)
    .then((result) => {
      if (!result.status) {
        return next(createError(500, result.message));
      }

      return jsonResponse(res, 200, true, "", result.data);
    })
    .catch((err) => next(createError(500, err.message)));
};

const getRemainingOf = (req, res, next) => {
  const _expenser_id = new ObjectId(req._expenser_id);

  Expenser.getRemainingOf(_expenser_id).then((result) => {
    if (!result.status) {
      return next(createError(500, result.message));
    }

    return jsonResponse(res, 200, true, "", result.data);
  });
};

const getAvgDaily = (req, res, next) => {
  const _expenser_id = new ObjectId(req._expenser_id);

  Expenser.getAvgDaily(_expenser_id).then((result) => {
    if (!result.status) {
      return next(createError(500, result.message));
    }

    return jsonResponse(res, 200, true, "", result.data);
  });
};

module.exports = {
  addTotalExpens,
  getAllExpense,
  getRemainingOf,
  getAvgDaily,
};
