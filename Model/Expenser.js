const { ObjectId } = require("bson");
const { dbConnection, dateFormate } = require("../Configurations");
const { expenserValidtor } = require("../Validators");

class Expenser {
  /*
  _user_id, WholeExpense, ... late
  */
  constructor(expenserData) {
    this.expenserData = expenserData;
  }

  static validate(data) {
    try {
      return expenserValidtor.validate(data);
    } catch {
      return false;
    }
  }

  save(cb) {
    dbConnection("expenser", async (clc) => {
      try {
        await clc.insertOne(this.expenserData);
        cb({
          status: true,
          message: "Expenser had been created !!",
        });
      } catch (err) {
        cb({
          status: false,
          message: err.message,
        });
      }
    });
  }

  static addTotalExpens(data, cb) {
    dbConnection("expenser", async (clc) => {
      try {
        await clc.updateOne(
          {
            _id: data._expenser_id,
          },
          {
            $set: {
              total_expense: data.total_expense,
            },
          }
        );

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

  static getAllExpense(_expenser_id) {
    return new Promise((resolve, reject) => {
      dbConnection("expenses", async (clc) => {
        try {
          const expenses = await clc
            .find({
              _expenser_id: _expenser_id,
            })
            .toArray();

          let obj = {};

          expenses.map((exp) => {
            let value = 0;
            exp.date = new Date(exp.date).getMonth() + 1;
            try {
              value =
                obj[exp.date][exp.type] === undefined
                  ? 0
                  : obj[exp.date][exp.type];
            } catch {
              value = 0;
            }
            obj = {
              ...obj,
              [exp.date]: {
                ...obj[exp.date],
                [exp.type]: exp.value + value,
              },
            };
          });

          resolve({
            status: true,
            data: obj,
          });
        } catch (err) {
          reject({
            status: false,
            message: err.message,
          });
        }
      });
    });
  }

  static getRemainingOf(_expenser_id) {
    return new Promise((resolve, reject) => {
      dbConnection("expenses", async (clc) => {
        // update !!! ??
        try {
          const expenses = await clc
            .find({
              _expenser_id: _expenser_id,
            })
            .toArray();

          let sum = 0;

          for (let i = 0; i < expenses.length; i++) {
            const expenseDate = new Date(expenses[i].date).getMonth() + 1;
            const curDate = new Date(dateFormate).getMonth() + 1;
            if (expenseDate === curDate) {
              sum += expenses[i].value;
            }
          }

          dbConnection("expenser", async (clc) => {
            const expenser = await clc.findOne({
              _id: _expenser_id,
            });
            const totalExpense = expenser.total_expense;
            const total = totalExpense - sum;

            resolve({
              status: true,
              data: total,
            });
          });
        } catch (err) {
          reject({
            status: false,
            message: err.message,
          });
        }
      });
    });
  }

  static getAvgDaily(_expenser_id) {
    return new Promise((resolve, reject) => {
      dbConnection("expenses", async (clc) => {
        try {
          const expenses = await clc
            .find({
              _expenser_id: _expenser_id,
            })
            .toArray();

          if (expenses) {
            let sum = 0;
            let count = 0;

            for (let i = 0; i < expenses.length; i++) {
              const expenseDay = new Date(expenses[i].date).getDate();
              const curDay = new Date(dateFormate).getDate();
              if (expenseDay === curDay) {
                count += 1;
                sum += expenses[i].value;
              }
            }

            if (count === 0) {
              resolve({
                status: true,
                data: "No Expense today",
              });
            }
            const avg = sum / count;
            resolve({
              status: true,
              data: avg,
            });
          }

          resolve({
            status: false,
            data: "No users",
          });
        } catch (err) {
          reject({
            status: false,
            message: err.message,
          });
        }
      });
    });
  }
}

module.exports = Expenser;
