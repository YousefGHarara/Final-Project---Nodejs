const { hashSync, compareSync } = require("bcryptjs");
const { dbConnection } = require("../Configurations");
const { userValidator, loginValidtor } = require("../Validators");

class User {
  constructor(userData) {
    this.userData = userData;
  }

  static validate(userData) {
    try {
      return userValidator.validate(userData);
    } catch {
      return false;
    }
  }

  isExists() {
    return new Promise((resolve, reject) => {
      dbConnection("users", async (clc) => {
        try {
          const user = await clc.findOne({
            $or: [
              { username: this.userData.username },
              { email: this.userData.email },
            ],
          });

          if (!user) {
            resolve({
              status: false,
            });
          } else {
            if (user.username === this.userData.username) {
              resolve({
                status: true,
                message: "username is already exists",
              });
            } else if (user.email === this.userData.email) {
              resolve({
                status: true,
                message: "email is already exists",
              });
            }
          }
        } catch (err) {
          reject({
            status: true,
          });
        }
      });
    });
  }

  static getOne(_id) {
    return new Promise((resolve, reject) => {
      dbConnection("users", async (clc) => {
        try {
          const user = await clc.findOne({ _id: _id });

          if (!user) {
            resolve({
              status: false,
              message: "user not found !!",
            });
          } else {
            resolve({
              status: true,
              data: user,
            });
          }
        } catch (err) {
          reject({
            status: false,
            message: err.message,
          });
        }
      });
    });
  }

  save(cb) {
    dbConnection("users", async (clc) => {
      try {
        const hashPassword = hashSync(this.userData.password);
        this.userData.password = hashPassword;
        await clc.insertOne(this.userData).then((result) => {
          cb({
            status: true,
            _user_id: result.insertedId,
          });
        });
      } catch (err) {
        cb({
          status: false,
          message: err.message,
        });
      }
    });
  }

  // static remove(_id, cb) {
  //   dbConnection("users", async (clc) => {
  //     try {
  //       await clc.deleteOne({ _id: _id });
  //       cb({
  //         status: true,
  //       });
  //     } catch {
  //       cb({
  //         status: false,
  //         message: "user not found !",
  //       });
  //     }
  //   });
  // }

  static login(loginData) {
    return new Promise((resolve, reject) => {
      console.log("I");
      const validation = loginValidtor.validate(loginData);
      console.log("II");
      console.log(validation);
      
      if (validation.error) {
        console.log("III");
        return resolve({
          status: false,
          message: validation.error.message,
          code: 409,
        });
      }
      console.log("IV");
      
      console.log("");
      dbConnection("users", async (clc) => {
        try {
          const user = await clc.findOne({
            username: loginData.username,
          });
          
          if (!user) {
            resolve({
              status: false,
              message: "login faild",
              code: 402,
            });
          }

          if (!compareSync(loginData.password, user.password)) {
            resolve({
              status: false,
              message: "incorrect password or username",
              code: 402,
            });
          }

          dbConnection("expenser", async (clc) => {
            const expenser = await clc.findOne({
              _user_id: user._id,
            });

            
            if (expenser) {
              user.expenser = expenser;
            }
            console.log(user);
            console.log("expenser");

            resolve({
              status: true,
              data: user,
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
}

module.exports = User;
