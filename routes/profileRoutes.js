import express from 'express';
import { Profile } from '../controllers';
import { verifyToken, profileValidations } from '../middlewares';

const { interestsValidator, nameValidator } = profileValidations;
const { updateProfile } = Profile;

const router = express.Router();

<<<<<<< HEAD
router.route('/')
  .patch(
    verifyToken,
    categoryValidator,
=======
router.route('/profile')
  .patch(
    verifyToken,
    interestsValidator,
>>>>>>> c705d6f3cf825d6112fa9a9c9226ab7bf5e08824
    nameValidator,
    updateProfile
  );
export default router;
