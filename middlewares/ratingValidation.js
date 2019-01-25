import { isNumeric } from 'validator';

export default {
  userIsMentor(req, res, next) {
    const { isMentor } = req.decoded;
    if (isMentor === false) {
      const error = new Error('Only mentors can rate articles');
      error.status = 401;
      return next(error);
    }
    return next();
  },

  isRateValueSupplied(req, res, next) {
    const { rateValue } = req.body;
    if (!(rateValue in req.body)) {
      const error = new Error('Rate value must be provided');
      error.status = 400;
      return next(error);
    }
    return next();
  },

  inputTypeIsValid(req, res, next) {
    const { rateValue } = req.body;
    if (!isNumeric(rateValue)) {
      const error = new Error('Value must be a number');
      error.status = 400;
      return next(error);
    }
    return next();
  },

  ratingIsInRange(req, res, next) {
    const { rateValue } = req.body;
    if (rateValue > 5 || rateValue < 1) {
      const errorMessage = 'Value must not be less than 1 or greater than 5';
      const error = new Error(errorMessage);
      error.status = 400;
      return next(error);
    }
    return next();
  }
};
