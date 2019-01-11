import express from 'express';
import Users from '../controllers/user';
import { userValidations } from '../middlewares';

const {
  expectedParamsValidator,
  nonEmptyParamsValidator,
  emailExistsValidator,
  usernameExistsValidator,
  emailIsValid,
  usernameValidator,
  passwordValidator


} = userValidations;

const {
  login,
  register
} = Users;

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
  .post(login);

export default router;
