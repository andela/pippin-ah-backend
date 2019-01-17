import express from 'express';
import Profile from '../controllers/profile';
import { verifyToken, profileValidation } from '../middlewares';

const {
  categoryValidator,
  nameValidator,
  searchExistence
} = profileValidation;
const {
  createProfile
} = Profile;

const router = express.Router();

router.route('/profile')
  .all(verifyToken)
  .post(
    searchExistence,
    categoryValidator,
    nameValidator,
    createProfile
  );
export default router;
