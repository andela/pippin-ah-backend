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
    const { id } = req.decoded;
    const {
      firstName,
      lastName,
      bio,
      category,
      imageURL
    } = req.body;
    const profile = await Profile
      .create({
        firstName,
        lastName,
        bio,
        category,
        imageURL,
        userId: id
      });
    return res.status(201).json({
      message: 'Profile created successfully',
      firstName: profile.firstName,
      lastName: profile.lastName,
      bio: profile.bio,
      category: profile.category,
      imageURL: profile.imageURL
    });
  }
}

export default Profiles;
