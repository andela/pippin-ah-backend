import validation from 'validator';
import { categories as interestsEnum } from '../helpers';

export default {
  interestsValidator(req, res, next) {
    if (req.body.interests) {
      let { interests } = req.body;
      if (!Array.isArray(interests)) {
        interests = [interests.toString()];
      }
      const errorArray = [];
      (interests).forEach((item) => {
        if (!interestsEnum.includes(item)) {
          errorArray.push(item);
        }
      });
      if (!errorArray.length) return next();
      const pluralize = errorArray.length === 1 ? 'category' : 'categories';
      const stringifiedErrorArray = JSON.stringify(errorArray);
      const stringifiedAllowedCategories = JSON.stringify(interestsEnum);
      // eslint-disable-next-line
      const errorMessage = `Invalid ${pluralize} ${stringifiedErrorArray}. Allowed categories are ${stringifiedAllowedCategories}`;
      const error = new Error(errorMessage);
      error.status = 400;
      return next(error);
    }
    return next();
  },

  nameValidator(req, res, next) {
    const nameParams = ['firstName', 'lastName'];
    const errorArray = [];
    const errorArray2 = [];
    nameParams.forEach((param) => {
      if (Object.keys(req.body).includes(param)) {
        if (!validation.isAlpha(req.body[param])) {
          errorArray.push(`${param} must be alphabet`);
        }
      }
    });

    if (errorArray.length) {
      const errorMessage = JSON.stringify(errorArray);
      const error = new Error(errorMessage);
      error.status = 400;
      return next(error);
    }

    nameParams.forEach((param) => {
      if (Object.keys(req.body).includes(param)) {
        if (req.body[param].trim().length < 2) {
          errorArray2.push(`${param} must be at least 2 characters long`);
        }
      }
    });

    if (!errorArray2.length) {
      return next();
    }

    const errorMessage2 = JSON.stringify(errorArray2);
    const error = new Error(errorMessage2);
    error.status = 400;
    return next(error);
  }
};
