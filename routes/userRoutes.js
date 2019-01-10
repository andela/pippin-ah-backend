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

<<<<<<< HEAD
=======
router.route('/login')
  .post(login);

router.route('/')
  .post(signup, register);

>>>>>>> feat(descriptive error):create a userValidations.js
export default router;
