import express from 'express';
import { Profile, Follow, getUserStats } from '../controllers';
import {
  verifyToken,
  profileValidations,
  followValidations
} from '../middlewares';

const { interestsValidator, nameValidator } = profileValidations;
const { updateProfile } = Profile;
const { canFollowUser } = followValidations;
const { followUser, getFollowing, getFollowers } = Follow;
const router = express.Router();

router.route('/')
  .patch(
    verifyToken,
    interestsValidator,
    nameValidator,
    updateProfile
  );

router.route('/:username/follow')
  .all(verifyToken)
  .post(canFollowUser, followUser);

router.route('/following')
  .get(verifyToken, getFollowing);

router.route('/followers')
  .get(verifyToken, getFollowers);

router.route('/stats')
  .get(getUserStats);

export default router;
