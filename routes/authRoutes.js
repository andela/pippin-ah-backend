import express from 'express';
import { Users } from '../controllers';
import { userValidations, authenticateTwitter } from '../middlewares';

import {
  googleStrategy,
  facebookStrategy,
  twitterStrategy
} from '../config/strategies';

const {
  sendTwitterUser,
  getTwitterUser
} = authenticateTwitter;

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
  isValidToken,
  isInputTypeValid
} = userValidations;

const {
  login,
  register,
  sendPasswordResetToken,
  validTokenResponse,
  setNewPassword
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
  twitterTokenAuth,
  twitterOnAuthSuccess,
} = twitterStrategy;

const router = express.Router();

router.route('/')
  .post(
    isInputTypeValid,
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
    isInputTypeValid,
    loginParamsValidator,
    loginNonEmptyParamsValidator,
    invalidCredentials,
    login
  );

router.route('/google')
  .get(googleAuthenticate);

router.route('/google/redirect')
  .get(googleRedirect, googleOnAuthSuccess);

router.route('/twitter/reverse')
  .post(sendTwitterUser);

router.route('/twitter')
  .post(getTwitterUser, twitterTokenAuth, twitterOnAuthSuccess);

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
    setNewPassword
  );

router.route('/resetpassword/:token')
  .get(
    isValidToken,
    validTokenResponse
  );

export default router;
