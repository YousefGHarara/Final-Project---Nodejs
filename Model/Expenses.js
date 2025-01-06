const { Expenser } = require(".");
const { dbConnection } = require("../Configurations");
const { expensesValidtor } = require("../Validators");

class Expenses {
  constructor(expensesData) {
    this.expensesData = expensesData;
  }

  static validate(expensesData) {
    try {
      return expensesValidtor.validate(expensesData);
    } catch (err) {
      return false;
    }
  }

  save(cb) {
    dbConnection("expenses", async (clc) => {
      try {
        
        await clc.insertOne(this.expensesData);
        cb({
          status: true,
        });
      } catch (err) {
        cb({
          status: false,
          message: err.message,
        });
      }
    });
  }

  static getAllById(_expenser_id, cb) {
    dbConnection("expenses", async (clc) => {
      try {
        const expenses = await clc
          .find({
            _expenser_id: _expenser_id,
          })
          .toArray();

        cb({
          status: true,
          data: expenses,
        });
      } catch (err) {
        cb({
          status: false,
          message: err.message,
        });
      }
    });
  }
}

module.exports = Expenses;
