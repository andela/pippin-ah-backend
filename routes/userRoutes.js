import express from 'express';
import Users from '../controllers/user';
import { userValidations } from '../middlewares';

const {
  getUser,
  updateUser,
} = Users;

const router = express.Router();

router.route('/:userId')
  .get(userValidations.isUser, getUser)
  .put(updateUser);

export default router;
