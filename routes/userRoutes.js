import express from 'express';
import Users from '../controllers/user';
import Request from '../controllers/request';
import { verifyToken, userValidations } from '../middlewares';

const {
  emailIsValid,
  emailExistsValidator,
  isUsernameValidator,
  usernameExistsValidator,
  passwordValidator
} = userValidations;
const { approveRequest } = Request;
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

router.route('/request/resolve')
  .patch(
    verifyToken,
    approveRequest
  );

router.route('/authors')
  .get(verifyToken, getAllAuthors);

export default router;
