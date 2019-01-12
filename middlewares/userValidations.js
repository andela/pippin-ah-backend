import Sequelize from 'sequelize';
import validation from 'validator';
import models from '../models';

const { iLike } = Sequelize.Op;
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
    const used = await User.findOne({ where: { username: { [iLike]: username } } });
    if (used) {
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
    // eslint-disable-next-line no-empty
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
    // eslint-disable-next-line no-empty
    if (req.body.password.length < 8) {
      const error = new Error(
        'Your password must be at least 8 characters');
      error.status = 400;
      return next(error);
    }
    next();
  }

};
