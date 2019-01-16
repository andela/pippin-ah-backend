import express from 'express';
import Users from '../controllers/user';
import { userValidations } from '../middlewares';
import googleStrategy from '../config/strategies';

const {
  expectedParamsValidator,
  nonEmptyParamsValidator,
  emailExistsValidator,
  usernameExistsValidator,
  emailIsValid,
  isUsernameValidator,
  passwordValidator,
  loginParamsValidator,
  loginNonEmptyParamsValidator,
  invalidCredentials
} = userValidations;

const {
  login,
  register
} = Users;

const {
  authenticate,
  redirect,
  onAuthSuccess
} = googleStrategy;

const router = express.Router();

router.route('/')
  .post(
    expectedParamsValidator,
    nonEmptyParamsValidator,
    emailIsValid,
    isUsernameValidator,
    passwordValidator,
    emailExistsValidator,
    usernameExistsValidator,
    register
  );

router.route('/login')
  .post(
    loginParamsValidator,
    loginNonEmptyParamsValidator,
    invalidCredentials,
    login
  );

router.route('/google')
  .get(authenticate);

router.route('/google/redirect')
  .get(redirect, onAuthSuccess);

export default router;
