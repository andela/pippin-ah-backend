
import validation from 'validator';
import models from '../models';

const { Profile } = models;

const Categories = [
  'Science',
  'Technology',
  'Engineering',
  'Arts',
  'Mathematic'
];

export default {

  categoryValidator(req, res, next) {
    if (!Categories.includes(req.body.category)) {
      const error = new Error('Invalid category, Enter Science,Technology...');
      error.status = 400;
      return next(error);
    }
    return next();
  },

  nameValidator(req, res, next) {
    if (!validation.isAlpha(req.body.firstName)) {
      const error = new Error('first Name  must be alphabets');
      error.status = 400;
      return next(error);
    }
    if (!validation.isAlpha(req.body.lastName)) {
      const error = new Error('last Name  must be alphabets');
      error.status = 400;
      return next(error);
    }

    if (
      req.body.firstName.trim().length < 2
    || req.body.lastName.trim().length < 2
    ) {
      const error = new Error(
        'first Name and Last name must be atleast 2 chracter long');
      error.status = 400;
      return next(error);
    }
    return next();
  },

  async searchExistence(req, res, next) {
    const { id } = req.decoded;
    const found = await Profile.findOne({ where: { userId: id } });
    if (found) {
      const error = new Error(
        'Already have a profile, can only have one profile,Go update.'
      );
      error.status = 409;
      return next(error);
    }
    return next();
  }


};
