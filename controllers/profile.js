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

    const {
      firstName,
      lastName,
      bio,
      imageUrl,
      interests = []
    } = req.body;

    let normalizedInterests;

    normalizedInterests = interests;
    if (profile.interests) {
      normalizedInterests = [
        ...new Set(profile.interests.concat(interests))
      ];
    }

    const responseData = await profile
      .update({
        firstName: firstName || profile.firstName,
        lastName: lastName || profile.lastName,
        bio: bio || profile.bio,
        interests: normalizedInterests || profile.interests,
        imageUrl: imageUrl || profile.imageUrl
      });
    return res.json({
      message: 'Profile updated successfully',
      firstName: responseData.firstName,
      lastName: responseData.lastName,
      bio: responseData.bio,
      interests: responseData.interests,
      imageURL: responseData.imageURL
    });
  }
}

export default Profiles;
