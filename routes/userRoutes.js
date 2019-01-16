import express from 'express';
import Users from '../controllers/user';
import { verifyToken } from '../middlewares';

const {
  getUser,
  updateUser,
} = Users;

const router = express.Router();

router.route('/user')
  .all(verifyToken)
  .get(getUser)
  .put(updateUser);

export default router;
