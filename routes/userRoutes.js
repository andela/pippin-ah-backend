import express from 'express';
import { Users, Request } from '../controllers';
import {
  verifyToken,
  userValidations,
  requestValidations
} from '../middlewares';

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

const { requestToBeMentor } = Request;
const {
  canRequestToBeMentor,
  doesRequestExist,
  verifyAdmin
} = requestValidations;

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

router.route('/request/resolve/:id')
  .patch(
    verifyToken,
    doesRequestExist,
    verifyAdmin,
    approveRequest
  );

router.route('/authors')
  .get(verifyToken, getAllAuthors);

router.route('/request')
  .post(verifyToken, canRequestToBeMentor, requestToBeMentor);

export default router;
