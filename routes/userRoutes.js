import express from 'express';
import Users from '../controllers/user';
import { isUser } from '../middlewares';

const {
  getUser,
  updateUser,
} = Users;

const router = express.Router();

router.route('/:userId')
  .get(isUser.getUser, getUser)
  .put(updateUser);

export default router;
