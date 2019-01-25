import Sequelize from 'sequelize';
import models from '../models';
import { categories as categoryEnum } from '../helpers';

const { Article, Report } = models;
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

  categoryQueryValidator(req, res, next) {
    const { category } = req.query;
    if (category === undefined) {
      return next();
    }

    if (!categoryEnum.includes(category)) {
      const errorMessage = `Invalid category ${category}`;
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
    });

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
  },

  reportValidator(req, res, next) {
    if (!req.body.report) {
      const error = new Error('Report is required');
      error.status = 400;
      return next(error);
    }
    return next();
  },

  async checkIfUserAlreadyReported(req, res, next) {
    const { params: { slug } } = req;
    const { id: userId } = req.decoded;
    const article = await Article.findOne({ where: { slug } });
    if (article) {
      const idFound = await Report.findOne(
        {
          where:
        { articleId: article.id, userId }
        });
      if (idFound) {
        const error = new Error('Article already reported by you');
        error.status = 409;
        return next(error);
      }
      return next();
    }
    return next();
  }
};
