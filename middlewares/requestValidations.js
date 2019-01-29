import Sequelize from 'sequelize';
import models from '../models';

const { or } = Sequelize.Op;
const { Request } = models;

export default {
  async canRequestMentorship(req, res, next) {
    const currentRequest = await Request.findOne({
      where: {
        userId: req.decoded.id,
        status: {
          [or]: ['pending', 'approved']
        }
      }
    });
    if (!currentRequest) {
      return next();
    }
    const { status } = currentRequest;
    const error = new Error(
      status === 'pending' ? 'You already requested for mentorship'
        : 'You are already a mentor'
    );
    error.status = 409;
    return next(error);
  }

};
