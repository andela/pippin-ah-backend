import express from 'express';
import Users from '../controllers/user';
import { userValidations } from '../middlewares';
import {
  googleStrategy,
  facebookStrategy,
  twitterStrategy
} from '../config/strategies';

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
  invalidCredentials,
  ensureUsernameOrEmailParam,
  usernameOrEmailExists,
  ensurePasswordParams,
  isValidToken
} = userValidations;

const {
  login,
  register,
  sendPasswordResetToken,
  validTokenResponse
} = Users;

const {
  googleAuthenticate,
  googleRedirect,
  googleOnAuthSuccess
} = googleStrategy;

const {
  fbAuthenticate,
  fbRedirect,
  fbOnAuthSuccess
} = facebookStrategy;
const {
  twitterAuthenticate,
  twitterRedirect,
  twitterOnAuthSuccess,
} = twitterStrategy;

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
  .get(googleAuthenticate);

router.route('/google/redirect')
  .get(googleRedirect, googleOnAuthSuccess);

router.route('/twitter')
  .get(twitterAuthenticate);

router.route('/twitter/redirect')
  .get(twitterRedirect, twitterOnAuthSuccess);

router.route('/facebook')
  .get(fbAuthenticate);

router.route('/facebook/redirect')
  .get(fbRedirect, fbOnAuthSuccess);

router.route('/resetpassword')
  .post(
    ensureUsernameOrEmailParam,
    usernameOrEmailExists,
    sendPasswordResetToken
  );

router.route('/resetpassword/:token')
  .post(
    isValidToken,
    ensurePasswordParams,
    passwordValidator,
    // setNewPassword
  );

router.route('/resetpassword/:token')
  .get(
    isValidToken,
    validTokenResponse
    // setNewPassword
  );

export default router;
