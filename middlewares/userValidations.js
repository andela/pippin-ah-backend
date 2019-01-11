import validation from 'validator';
import models from '../models';

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
      if (!param.trim().length) {
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
  // signupValidator(req, res, next) {
  //   const { username, email, password } = req.body;

  //   if (validation.isEmail(req.body.email)) {
  //     User.findOne({ where: { email: req.body.email } })
  //       .then((user) => {
  //         if (user) {
  //           const error = new Error('Email already in use');
  //           error.status = 409;
  //           return next(error);
  //         }
  //         next();
  //       });
  //   }

  //   if (!username
  //      && !email
  //      && !password
  //   ) {
  //     return res.status(400).send({ message: 'All fields are required' });
  //   }
  //   if (!validation.isEmail(req.body.email)) {
  //     return res.status(400).send(
  //       { message: 'please Enter a valid Email' });
  //   }

  //   if (req.body.username === ''
  //   || typeof req.body.username
  //    === 'undefined'
  //   || req.body.username === null) {
  //     return res.status(400).send({ message: 'username field is required' });
  //   }
  //   if (!validation.isAlphanumeric(req.body.username)) {
  //     return res.status(400).send(
  //       { message: 'username must contain only alphabets and numbers' });
  //   }
  //   if (req.body.username.length < 6) {
  //     return res.status(400).send(
  //       { message: 'Your username must be at least 6 characters' });
  //   }

  //   if (req.body.password.length < 8) {
  //     return res.status(400).send(
  //       { message: 'Your password must be at least 8 characters' });
  //   }
  //   if (!validation.isAlphanumeric(req.body.password)) {
  //     return res.status(400).send(
  //       { message: 'password must contain only numbers and alphabet' });
  //   }

  //   next();
  // }
};
