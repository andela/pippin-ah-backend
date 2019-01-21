import express from 'express';
import Users from '../controllers/user';
import { verifyToken, userValidations } from '../middlewares';

const {
  emailIsValid,
  emailExistsValidator,
  isUsernameValidator,
  usernameExistsValidator,
  passwordValidator
} = userValidations;

const {
  getUser,
  updateUser,
  getAllAuthors
} = Users;

const router = express.Router();

router.route('/user')
  .all(verifyToken)
  .get(getUser)
  .patch(
    passwordValidator,
    isUsernameValidator,
    usernameExistsValidator,
    emailIsValid,
    emailExistsValidator,
    updateUser);

router.route('/authors')
  .all(verifyToken)
  .get(getAllAuthors);

export default router;
