import express from 'express';
import Profile from '../controllers/profile';
import { verifyToken, profileValidations } from '../middlewares';

const {
  categoryValidator,
  nameValidator
} = profileValidations;
const {
  updateProfile
} = Profile;

const router = express.Router();

router.route('/profile')
  .all(verifyToken)
  .patch(
    categoryValidator,
    nameValidator,
    updateProfile
  );
export default router;
