import Sequelize from 'sequelize';
import models from '../models';

const { iLike } = Sequelize.Op;
const { User, Connection, Profile } = models;

/**
 * @class
 */
class Follow {
  /**
   * Represents a controller.
   * @constructor
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   */
  static async addFollower(req, res) {
    const userToFollow = await User.findOne({
      where: { username: { [iLike]: req.params.username } },
      include: [
        {
          model: Profile,
          attributes: ['lastName', 'firstName', 'bio', 'category', 'imageUrl']
        }
      ]
    });
    await Connection.create({
      followerId: req.decoded.id,
      userId: userToFollow.id
    });
    return res.json({
      message: `You are now following ${userToFollow.username}`,
      profile: {
        username: userToFollow.username,
        firstName: userToFollow.Profile.firstName,
        lastName: userToFollow.Profile.lastName,
        bio: userToFollow.Profile.bio
      }
    });
  }

  /**
   * Represents a controller.
   * @constructor
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   */
  static async getFollowing(req, res) {
    const following = await Connection.findAll({
      where: { followerId: req.decoded.id },
      attributes: [],
      include: [
        {
          model: User,
          attributes: ['username'],
          include: [
            {
              model: Profile,
              attributes: [
                'lastName',
                'firstName',
                'bio',
                'category',
                'imageUrl'
              ]
            }
          ],
          as: 'userDetails'
        }
      ]
    });
    return res.json({
      message: 'Successfully fetched those you follow',
      following
    });
  }

  /**
   * Represents a controller.
   * @constructor
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   */
  static async getFollowers(req, res) {
    const followers = await Connection.findAll({
      where: { userId: req.decoded.id },
      attributes: [],
      include: [
        {
          model: User,
          attributes: ['username'],
          include: [
            {
              model: Profile,
              attributes: [
                'lastName',
                'firstName',
                'bio',
                'category',
                'imageUrl'
              ]
            }
          ],
          as: 'followerDetails'
        },
      ]
    });
    return res.json({
      message: 'Successfully fetched your followers',
      followers
    });
  }
}

export default Follow;
