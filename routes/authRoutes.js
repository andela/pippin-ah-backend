import express from 'express';
import Users from '../controllers/user';
import { userValidations } from '../middlewares';
import { googleStrategy, twitterStrategy } from '../config/strategies';

const {
  expectedParamsValidator,
  nonEmptyParamsValidator,
  emailExistsValidator,
  usernameExistsValidator,
  emailIsValid,
  usernameValidator,
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
  googleAuthenticate,
  googleRedirect,
  googleOnAuthSuccess
} = googleStrategy;

const {
  twitterAuthenticate,
  twitterOnAuthSuccess,
} = twitterStrategy;

const router = express.Router();

router.route('/')
  .post(
    expectedParamsValidator,
    nonEmptyParamsValidator,
    emailIsValid,
    usernameValidator,
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
  .get(googleAuthenticate);

router.route('/google/redirect')
  .get(googleRedirect, googleOnAuthSuccess);

router.route('/twitter')
  .get(twitterAuthenticate);

router.route('/twitter/redirect')
  .get(twitterOnAuthSuccess);

export default router;
