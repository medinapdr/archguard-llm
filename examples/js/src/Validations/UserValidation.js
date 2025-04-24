const ValidatorUtil = require("../Utils/ValidatorUtil");

class UserValidation {
  validateCreateUserParams(user) {
    return ValidatorUtil.validate(user, {
      name: [
        {
          handler: (value) => Boolean(value),
          errorMessage: "must_be_filled",
        },
      ],
    });
  }
}

module.exports = new UserValidation();

console.log("UserValidation loaded");
