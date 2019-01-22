import Sequelize from 'sequelize';
import models from '../models';

const { iLike } = Sequelize.Op;
const { User, Follow, Profile } = models;

export default {
  async followUser(req, res) {
    const userToFollow = await User.findOne({
      where: { username: { [iLike]: req.params.username } },
      include: [
        {
          model: Profile,
          attributes: ['lastName', 'firstName', 'bio', 'interests', 'imageUrl']
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
                'interests',
                'imageUrl'
              ]
            }
          ],
          as: 'userDetails'
        }
      ]
    });

    const response = following.map(item => (
      {
        username: item.userDetails.username,
        lastName: item.userDetails.Profile.lastName,
        firstName: item.userDetails.Profile.firstName,
        bio: item.userDetails.Profile.bio,
        interests: item.userDetails.Profile.interests,
        imageUrl: item.userDetails.Profile.imageUrl
      }
    ));

    return res.json({
      following: response,
      count: following.length
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
                'interests',
                'imageUrl'
              ]
            }
          ],
          as: 'followerDetails'
        },
      ]
    });

    const response = followers.map(item => (
      {
        username: item.followerDetails.username,
        lastName: item.followerDetails.Profile.lastName,
        firstName: item.followerDetails.Profile.firstName,
        bio: item.followerDetails.Profile.bio,
        interests: item.followerDetails.Profile.interests,
        imageUrl: item.followerDetails.Profile.imageUrl
      }
    ));


    return res.json({
      followers: response,
      count: followers.length
    });
  }
};
