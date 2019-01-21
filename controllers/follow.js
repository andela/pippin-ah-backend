import Sequelize from 'sequelize';
import models from '../models';

const { iLike } = Sequelize.Op;
const { User, Follow, Profile } = models;

export default {
  async addFollower(req, res) {
    const userToFollow = await User.findOne({
      where: { username: { [iLike]: req.params.username } },
      include: [
        {
          model: Profile,
          attributes: ['lastName', 'firstName', 'bio', 'category', 'imageUrl']
        }
      ]
    });
    await Follow.create({
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
  },
  async getFollowing(req, res) {
    const following = await Follow.findAll({
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
  },
  async getFollowers(req, res) {
    const followers = await Follow.findAll({
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
};
