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
  activateUser,
  getAllAuthors
} = Users;

const router = express.Router();
router.route('/activate/:userId')
  .get(activateUser);

router.route('/')
  .all(verifyToken)
  .get(getUser)
  .patch(
    passwordValidator,
    isUsernameValidator,
    usernameExistsValidator,
    emailIsValid,
    emailExistsValidator,
    updateUser
  );

router.route('/authors')
  .get(verifyToken, getAllAuthors);

export default router;
