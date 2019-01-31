import Sequelize from 'sequelize';
import validation from 'validator';
import { isString } from 'util';
import models from '../models';
import inputTypeValidator from './inputTypeValidator';

const { iLike, or, gt } = Sequelize.Op;
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
    if (email) {
      const used = await User.findOne({ where: { email: { [iLike]: email } } });
      if (used) {
        const error = new Error('Email already in use');
        error.status = 409;
        return next(error);
      }
      return next();
    }
    return next();
  },

  async usernameExistsValidator(req, res, next) {
    const { username } = req.body;
    if (username) {
      const usernameIsInUse = await User
        .findOne({ where: { username: { [iLike]: username } } });
      if (usernameIsInUse) {
        const error = new Error('Username already in use');
        error.status = 409;
        return next(error);
      }
      return next();
    }
    return next();
  },

  emailIsValid(req, res, next) {
    if ('email' in req.body) {
      if (!validation.isEmail(req.body.email)) {
        const error = new Error('please Enter a valid Email');
        error.status = 400;
        return next(error);
      }
      return next();
    }
    return next();
  },

  isUsernameValidator(req, res, next) {
    if (Object.keys(req.body).includes('username')) {
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
      return next();
    }
    return next();
  },

  passwordValidator(req, res, next) {
    if ('password' in req.body) {
      if (!validation.isAlphanumeric(req.body.password)) {
        const error = new Error(
          'password must contain only numbers and alphabets');
        error.status = 400;
        return next(error);
      }
      if (req.body.password.length < 8) {
        const error = new Error(
          'Your password must be at least 8 characters');
        error.status = 400;
        return next(error);
      }
      return next();
    }
    return next();
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

  ensureUsernameOrEmailParam(req, res, next) {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      const error = new Error(
        'email param is missing, empty or invalid'
      );
      error.status = 400;
      return next(error);
    }
    return next();
  },

  ensurePasswordParams(req, res, next) {
    const { password } = req.body;
    if (!password || typeof password !== 'string') {
      const error = new Error(
        'password param is missing, empty or invalid'
      );
      error.status = 400;
      return next(error);
    }
    next();
  },

  async usernameOrEmailExists(req, res, next) {
    const { email } = req.body;
    const user = await User
      .findOne({
        where: { email: { [iLike]: email } }
      });
    if (!user) {
      const error = new Error('user not found');
      error.status = 404;
      return next(error);
    }
    return next();
  },

  async isValidToken(req, res, next) {
    const { token } = req.params;
    const user = await User.findOne({
      where: {
        resetToken: token,
        tokenExpires: {
          [gt]: Math.floor(Date.now() / 1000)
        }
      }
    });
    if (!user) {
      const error = new Error('Invalid or expired token');
      error.status = 401;
      return next(error);
    }
    next();
  },

  async isInputTypeValid(req, res, next) {
    const {
      username, email, usernameOrEmail, password
    } = req.body;
    const initialArray = [username, email, usernameOrEmail, password];
    const inputArray = [];
    initialArray.forEach((param) => {
      if (param) inputArray.push(param);
    });
    inputTypeValidator(isString, inputArray, next);
    return next();
  }
};
