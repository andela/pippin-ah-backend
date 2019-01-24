import Sequelize from 'sequelize';
import models from '../models';
import { categories as categoryEnum } from '../helpers';

const { Article } = models;
const requiredParams = ['title', 'body', 'description', 'category'];
const { iLike } = Sequelize.Op;

export default {
  categoryValidator(req, res, next) {
    const { category } = req.body;

    if (!categoryEnum.includes(category)) {
      const stringifiedAllowedCategories = JSON.stringify(categoryEnum);
      // eslint-disable-next-line
      const errorMessage = `Invalid category [${category}]. Allowed categories are ${stringifiedAllowedCategories}`;
      const error = new Error(errorMessage);
      error.status = 400;
      return next(error);
    }

    return next();
  },

  expectedParamsValidator(req, res, next) {
    const errorArray = [];

    requiredParams.forEach((param) => {
      if (!Object.keys(req.body).includes(param)) {
        errorArray.push(`${param} is required`);
      }
    });

    if (!errorArray.length) {
      return next();
    }

    const errorMessage = JSON.stringify(errorArray);
    const error = new Error(errorMessage);
    error.status = 400;
    return next(error);
  },

  nonEmptyParamsValidator(req, res, next) {
    const errorArray = [];

    requiredParams.forEach((param) => {
      if (!req.body[param].trim().length) {
        errorArray.push(`${param} must not be empty`);
      }
    });

    if (!errorArray.length) {
      return next();
    }

    const errorMessage = JSON.stringify(errorArray);
    const error = new Error(errorMessage);
    error.status = 400;
    return next(error);
  },

  async existingTitleValidator(req, res, next) {
    const titleExists = await Article.findOne({
      where: {
        title: { [iLike]: req.body.title.trim() }, userId: req.decoded.id
      }
    }
    );

    if (titleExists) {
      const errorMessage = 'You already have an article with the same title';
      const error = new Error(errorMessage);
      error.status = 400;
      return next(error);
    }
    return next();
  },

  checkIfTagIsString(req, res, next) {
    const { tags } = req.body;
    if (typeof tags === 'string') return next();
    const error = new Error('tag must be a string');
    error.status = 400;
    return next(error);
  }
};
