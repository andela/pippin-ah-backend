import Sequelize from 'sequelize';
import models from '../models';

export default {
  verifyMentor(req, res, next) {
    const { isMentor } = req.decoded;
    if (isMentor === false) {
      const error = new Error('Only mentors can rate');
      error.status = 400;
      return next(error);
    }
    return next();
  }
};
