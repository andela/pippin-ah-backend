import express from 'express';
import { Profile } from '../controllers';
import { verifyToken, profileValidations } from '../middlewares';

const { interestsValidator, nameValidator } = profileValidations;
const { updateProfile } = Profile;

const router = express.Router();

router.route('/')
  .patch(
    verifyToken,
    interestsValidator,
    nameValidator,
    updateProfile
  );
export default router;
