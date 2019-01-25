import { isNumeric } from 'validator';

export default {
  verifyMentor(req, res, next) {
    const { isMentor } = req.decoded;
    if (isMentor === false) {
      const error = new Error('Only mentors can rate articles');
      error.status = 400;
      return next(error);
    }
    return next();
  },

  validateInputType(req, res, next) {
    const { newRating } = req.body;
    if (!isNumeric(newRating)) {
      const error = new Error('Value must be a number');
      error.status = 400;
      return next(error);
    }
    return next();
  },

  validateInputRange(req, res, next) {
    const { newRating } = req.body;
    if (newRating > 5 || newRating < 1) {
      const errorMessage = 'Value must not be less than 1 or greater than 5';
      const error = new Error(errorMessage);
      error.status = 400;
      return next(error);
    }
    return next();
  }
};
