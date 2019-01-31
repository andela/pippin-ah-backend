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
      where: { id: req.params.id }
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
  },

  checkForUuid(req, res, next) {
    // eslint-disable-next-line
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuid.test(req.params.id)) {
      const error = new Error('Invalid uuid');
      error.status = 400;
      return next(error);
    }
    return next();
  },

  async checkStatus(req, res, next) {
    const { params: { id } } = req;
    const approvedOrRejected = await Request.findOne({
      where: { id, status: { [or]: ['rejected', 'approved'] } }
    });
    if (!approvedOrRejected) {
      return next();
    }
    const { status } = approvedOrRejected;
    const error = new Error(
      status === 'approved' ? 'You are already a mentor'
        : 'You request has already been rejected'
    );
    error.status = 409;
    return next(error);
  },
};
