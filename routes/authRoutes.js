import express from 'express';
import Users from '../controllers/user';
import { UserValidations } from '../middlewares';

const { expectedParamsValidator, nonEmptyParamsValidator } = UserValidations;

const {
  login,
  register
} = Users;

const router = express.Router();

router.route('/')
  .post(
    expectedParamsValidator,
    nonEmptyParamsValidator,
    register
  );

router.route('/login')
  .post(login);

export default router;
