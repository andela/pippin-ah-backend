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
  },
  checkForUuid(req, res, next) {
    const { articleId } = req.body;
    // eslint-disable-next-line
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuid.test(articleId)) {
      const error = new Error('Invalid ArticleId');
      error.status = 400;
      return next(error);
    }
    return next();
  },

  reportValidator(req, res, next) {
    const required = ['articleId', 'report'];
    const errorArray = [];

    required.forEach((param) => {
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

  async checkIfArticleIdExists(req, res, next) {
    const { articleId: id } = req.body;

    if (id) {
      const articleFound = await Article.findOne({ where: { id } });
      if (!articleFound) {
        const error = new Error('Article not found');
        error.status = 409;
        return next(error);
      }
      return next();
    }
    return next();
  },

  async checkIfUserAlreadyReported(req, res, next) {
    const { articleId } = req.body;
    const { id: userId } = req.decoded;
    if (articleId) {
      const idFound = await Report.findOne({ where: { articleId, userId } });
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
