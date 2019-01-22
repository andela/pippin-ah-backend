import Sequelize from 'sequelize';
import models from '../models';
import { categories as categoryEnum } from '../helpers';

const { Article } = models;
const requiredParams = ['title', 'body', 'description', 'category'];
const { iLike } = Sequelize.Op;

export default {
  categoryValidator(req, res, next) {
    let { category } = req.body;

    if (!Array.isArray(category)) {
      category = [category.toString()];
    }

    const errorArray = [];

    (category).forEach((item) => {
      if (!categoryEnum.includes(item)) {
        errorArray.push(item);
      }
    });

    if (!errorArray.length) return next();

    const pluralize = errorArray.length === 1 ? 'category' : 'categories';
    const stringifiedErrorArray = JSON.stringify(errorArray);
    const stringifiedAllowedCategories = JSON.stringify(categoryEnum);
    // eslint-disable-next-line
      const errorMessage = `Invalid ${pluralize} ${stringifiedErrorArray}. Allowed categories are ${stringifiedAllowedCategories}`;
    const error = new Error(errorMessage);
    error.status = 400;
    return next(error);
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
    const articleExists = await Article.findOne({
      where: {
        title: { [iLike]: req.body.title.trim() }, userId: req.decoded.id
      }
    }
    );

    if (articleExists) {
      const errorMessage = 'You already have an article with the same title';
      const error = new Error(errorMessage);
      error.status = 400;
      return next(error);
    }
    return next();
  }

};
