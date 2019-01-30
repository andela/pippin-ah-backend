import Sequelize from 'sequelize';
import models from '../models';

const { or } = Sequelize.Op;
const { Request } = models;

export default {
  async canRequestToBeMentor(req, res, next) {
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
      status === 'pending' ? 'You already requested to be a mentor'
        : 'You are already a mentor'
    );
    error.status = 409;
    return next(error);
  },

  async doesRequestExist(req, res, next) {
    const requestFound = await Request.findOne({
      where: {
        id: req.params.id
      }
    });
    if (requestFound) {
      return next();
    }

    const error = new Error('Request not found');
    error.status = 409;
    return next(error);
  },

  async verifyAdmin(req, res, next) {
    const { decoded: { isAdmin } } = req;

    if (isAdmin) {
      return next();
    }

    const error = new Error('Unauthorized');
    error.status = 401;
    return next(error);
  }
};
