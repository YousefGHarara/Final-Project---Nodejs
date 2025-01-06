const createError = require("http-errors");
const { User, Expenser } = require("../Model");
const { readFileSync } = require("fs");
const jwt = require("jsonwebtoken");

const signup = (req, res, next) => {
  const userData = req.body;

  const validation = User.validate(userData);
  console.log(validation);
  if (validation.error) {
    return next(createError(400, validation.error.message));
  }

  const user = new User(userData);
  user
    .isExists()
    .then((result) => {
      if (result.status) {
        return next(createError(400, result.message));
      } else {
        // save-user
        user.save((result) => {
          if (!result.status) {
            return next(createError(400, result.message));
          }

          const expenser = new Expenser({
            name: userData.name,
            _user_id: result._user_id,
            total_expense: 0,
          });

          expenser.save((result) => {
            if (!result.status) {
              return next(createError(500, result.message));
            }
            user.expenser = expenser;
            return jsonResponse(
              res,
              201,
              true,
              "User had been created success !!",
              user
            );
          });
        });
      }
    })
    .catch((err) => {
      return next(createError(500, err.message));
    });
};

const login = (req, res, next) => {
  const loginData = req.body;
  User.login(loginData).then((result) => {
    if (!result.status) {
      return next(createError(result.code, result.message));
    }else {
      const jwtSecretKey = readFileSync("./Configurations/private.key");

    const token = jwt.sign(
      {
        _id: result.data._id,
        _expenser_id: result.data.expenser._id
      },
      jwtSecretKey
    );

    return jsonResponse(res, 200, true, "", token);
    }

  }).catch(err => next(createError(500, err.message)));
};

module.exports = {
  signup,
  login,
};
