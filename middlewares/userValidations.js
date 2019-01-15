import Sequelize from 'sequelize';
import validation from 'validator';
import models from '../models';

const { iLike, or } = Sequelize.Op;
const { User } = models;

const requiredParams = ['username', 'email', 'password'];
const nonEmptyParams = ['username', 'email', 'password'];

export default {
  expectedParamsValidator(req, res, next) {
    const errorArray = [];

    requiredParams.forEach((param) => {
      if (!Object.keys(req.body).includes(param)) {
        errorArray.push(`${param} is required`);
      }
    });

    if (!errorArray.length) {
      return next();
    }

    const errorMessage = JSON.stringify(errorArray);
    const error = new Error(errorMessage);
    error.status = 400;
    return next(error);
  },

  nonEmptyParamsValidator(req, res, next) {
    const errorArray = [];

    nonEmptyParams.forEach((param) => {
      if (!req.body[param].trim().length) {
        errorArray.push(`${param} must not be empty`);
      }
    });

    if (!errorArray.length) {
      return next();
    }

    const errorMessage = JSON.stringify(errorArray);
    const error = new Error(errorMessage);
    error.status = 400;
    return next(error);
  },

  async emailExistsValidator(req, res, next) {
    const { email } = req.body;
    const used = await User.findOne({ where: { email: { [iLike]: email } } });
    if (used) {
      const error = new Error('Email already in use');
      error.status = 409;
      return next(error);
    }
    next();
  },

  async usernameExistsValidator(req, res, next) {
    const { username } = req.body;
    const usernameIsInUse = await User
      .findOne({ where: { username: { [iLike]: username } } });
    if (usernameIsInUse) {
      const error = new Error('Username already in use');
      error.status = 409;
      return next(error);
    }
    next();
  },

  emailIsValid(req, res, next) {
    if (!validation.isEmail(req.body.email)) {
      const error = new Error('please Enter a valid Email');
      error.status = 400;
      return next(error);
    }
    next();
  },

  usernameValidator(req, res, next) {
    if (!validation.isAlphanumeric(req.body.username)) {
      const error = new Error(
        'username must contain only alphabets and numbers');
      error.status = 400;
      return next(error);
    }

    if (req.body.username.length < 6) {
      const error = new Error(
        'Your username must be at least 6 characters');
      error.status = 400;
      return next(error);
    }
    next();
  },

  passwordValidator(req, res, next) {
    if (!validation.isAlphanumeric(req.body.password)) {
      const error = new Error(
        'password must contain only numbers and alphabet');
      error.status = 400;
      return next(error);
    }
    if (req.body.password.length < 8) {
      const error = new Error(
        'Your password must be at least 8 characters');
      error.status = 400;
      return next(error);
    }
    next();
  },

  loginParamsValidator(req, res, next) {
    const availableParams = ['usernameOrEmail', 'password'];

    const errorArray = [];

    availableParams.forEach((param) => {
      if (!Object.keys(req.body).includes(param)) {
        errorArray.push(`${param} is required`);
      }
    });

    if (!errorArray.length) {
      return next();
    }

    const errorMessage = JSON.stringify(errorArray);
    const error = new Error(errorMessage);
    error.status = 400;
    return next(error);
  },

  loginNonEmptyParamsValidator(req, res, next) {
    const availableParams = ['usernameOrEmail', 'password'];
    const errorArray = [];

    availableParams.forEach((param) => {
      if (!req.body[param].trim().length) {
        errorArray.push(`${param} must not be empty`);
      }
    });

    if (!errorArray.length) {
      return next();
    }

    const errorMessage = JSON.stringify(errorArray);
    const error = new Error(errorMessage);
    error.status = 400;
    return next(error);
  },

  async invalidCredentials(req, res, next) {
    const { usernameOrEmail, password } = req.body;
    const loginUser = await User
      .findOne({
        where: {
          [or]: [
            { username: { [iLike]: usernameOrEmail } },
            { email: { [iLike]: usernameOrEmail } }
          ]
        }
      });

    if (!loginUser) {
      const error = new Error('Invalid Credentials');
      error.status = 400;
      return next(error);
    }
    const validPassword = await loginUser.validPassword(password);
    if (!validPassword) {
      const error = new Error('Invalid Password');
      error.status = 400;
      return next(error);
    }
    next();
  },

  async isNewUser(req, res, next) {
    const { email } = req.body;
    const used = await User.findOne({ where: { email: { [iLike]: email } } });
    if (used) {
      const error = new Error('Email already in use');
      error.status = 409;
      return next(error);
    }
    next();
  }
};
