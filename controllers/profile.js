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
  static async createProfile(req, res) {
    const profile = await Profile.findOne({
      where: { userId: req.decoded.id }
    });
    const userProfile = await profile
      .update({
        firstName: req.body.firstName || profile.firstName,
        lastName: req.body.lastName || profile.lastName,
        bio: req.body.bio || profile.bio,
        category: req.body.category || profile.category,
        imageUrl: req.body.imageUrl || profile.imageUrl
      });
    return res.status(200).json({
      message: 'Profile updated successfully',
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      bio: userProfile.bio,
      category: userProfile.category,
      imageURL: userProfile.imageURL
    });
  }
}

export default Profiles;
