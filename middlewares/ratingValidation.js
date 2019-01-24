import { isNumeric } from 'validator';

export default {
  verifyMentor(req, res, next) {
    const { isMentor } = req.decoded;
    if (isMentor === false) {
      const error = new Error('Only mentors can rate');
      error.status = 400;
      return next(error);
    }
    return next();
  },

  validateInputType(req, res, next) {
    const { newRating } = req.body;
    const value = isNaN(newRating);
    if (!isNumeric(newRating)) {
      const error = new Error('Value must be a number');
      error.status = 400;
      return next(error);
    }
    return next();
  },

};
