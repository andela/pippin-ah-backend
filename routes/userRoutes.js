import express from 'express';
import Users from '../controllers/user';

const {
  getUser,
  updateUser,
} = Users;

const router = express.Router();

router.route('/:userId')
  .get(getUser)
  .put(updateUser);

export default router;
