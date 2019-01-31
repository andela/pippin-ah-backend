import Sequelize from 'sequelize';
import models from '../models';

const { iLike } = Sequelize.Op;
const { User, Follow } = models;

export default {
  async canFollowUser(req, res, next) {
    const userToFollow = await User.findOne({
      where: { username: { [iLike]: req.params.username } }
    });
    if (!userToFollow) {
      const error = new Error('The user provided does not exist');
      error.status = 404;
      return next(error);
    }
    if (userToFollow.id === req.decoded.id) {
      const error = new Error('You cannot follow yourself');
      error.status = 400;
      return next(error);
    }
    const alreadyFollowing = await userToFollow.getUserDetails({
      where: {
        followerId: req.decoded.id
      }
    });
    if (alreadyFollowing.length) {
      const error = new Error('You are already following this user');
      error.status = 409;
      return next(error);
    }
    return next();
  }

};
