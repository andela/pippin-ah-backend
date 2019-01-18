
import validation from 'validator';

const Categories = [
  'Science',
  'Technology',
  'Engineering',
  'Arts',
  'Mathematic'
];

export default {

  categoryValidator(req, res, next) {
    if (Object.keys(req.body).includes('category')) {
      if (!Categories.includes(req.body.category)) {
        const allowedList = JSON.stringify(Categories);
        // eslint-disable-next-line max-len
        const errorMessage = `Invalid category. Allowed categories are ${allowedList}`;
        const error = new Error(errorMessage);
        error.status = 400;
        return next(error);
      }
      return next();
    }
    return next();
  },

  nameValidator(req, res, next) {
    const nameParams = ['firstName', 'lastName'];
    const errorArray = [];
    if (Object.keys(req.body).includes('firstName')) {
      if (!validation.isAlpha(req.body.firstName)) {
        const error = new Error('first Name  must be alphabet');
        error.status = 400;
        return next(error);
      }
    }
    if (Object.keys(req.body).includes('lastName')) {
      if (!validation.isAlpha(req.body.lastName)) {
        const error = new Error('last Name  must be alphabet');
        error.status = 400;
        return next(error);
      }
    }
    nameParams.forEach((param) => {
      if (Object.keys(req.body).includes(param)) {
        if (req.body[param].trim().length < 2) {
          errorArray.push(`${param} must be at least 2 characters long`);
        }
      }
    });

    if (!errorArray.length) {
      return next();
    }

    const errorMessage = JSON.stringify(errorArray);
    const error = new Error(errorMessage);
    error.status = 400;
    return next(error);
  }


};
