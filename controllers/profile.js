import dotenv from 'dotenv';
import 'babel-polyfill';
import models from '../models';

dotenv.config();

const { Profile } = models;

/**
 * @class
 */
class Profiles {
  /**
    * Represents a controller.
    * @constructor
    * @param {object} req - The request object.
    * @param {object} res - The response object.
    */
  static async updateProfile(req, res) {
    const profile = await Profile.findOne({
      where: { userId: req.decoded.id }
    });
    const userProfile = await profile
      .update({
        firstName: req.body.firstName || profile.firstName,
        lastName: req.body.lastName || profile.lastName,
        bio: req.body.bio || profile.bio,
        interests: req.body.interests || profile.interests,
        imageUrl: req.body.imageUrl || profile.imageUrl
      });
    return res.json({
      message: 'Profile updated successfully',
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      bio: userProfile.bio,
      interests: userProfile.interests,
      imageURL: userProfile.imageURL
    });
  }
}

export default Profiles;
