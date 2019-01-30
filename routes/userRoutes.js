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
const { approveRequest, rejectRequest } = Request;
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
  verifyAdmin,
  checkForUuid
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

router.route('/request/approve/:id')
  .patch(
    verifyToken,
    checkForUuid,
    doesRequestExist,
    verifyAdmin,
    approveRequest
  );

router.route('/request/reject/:id')
  .patch(
    verifyToken,
    checkForUuid,
    doesRequestExist,
    verifyAdmin,
    rejectRequest
  );

router.route('/authors')
  .get(verifyToken, getAllAuthors);

router.route('/request')
  .post(verifyToken, canRequestToBeMentor, requestToBeMentor);

export default router;
