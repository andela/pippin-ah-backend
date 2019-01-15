import express from 'express';
import Users from '../controllers/user';
import { userValidations, verifyToken } from '../middlewares';

const {
  getUser,
  updateUser,
} = Users;

const { userExists, userParamIsInteger } = userValidations;

const router = express.Router();

router.route('/:userId')
  .get(userParamIsInteger, userExists, getUser)
  .put(updateUser);

export default router;
