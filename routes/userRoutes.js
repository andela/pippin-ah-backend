import express from 'express';
import Users from '../controllers/user';
import userValidations from '../middlewares';

const { signup } = userValidations;

const {
  getUser,
  updateUser,
} = Users;

const router = express.Router();

router.route('/:userId')
  .get(getUser)
  .put(updateUser);

export default router;
