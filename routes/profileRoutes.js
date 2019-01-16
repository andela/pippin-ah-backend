import express from 'express';
import Profile from '../controllers/profile';
import { verifyToken } from '../middlewares';


const {
  createProfile
} = Profile;

const router = express.Router();

router.route('/profile')
  .all(verifyToken)
  .post(createProfile);

export default router;
