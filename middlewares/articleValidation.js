import Sequelize from 'sequelize';
import { isString } from 'util';
import models from '../models';
import inputTypeValidator from './inputTypeValidator';
import { categories as categoryEnum } from '../helpers';

const { Article, Bookmark, Report } = models;
const requiredParams = ['title', 'body', 'description', 'category'];
const { iLike } = Sequelize.Op;

export default {
  categoryValidator(req, res, next) {
    const { category } = req.body;

    if (!categoryEnum.includes(category.trim())) {
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
    if (!category) return next();

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

    if (!errorArray.length) return next();

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

    if (!errorArray.length) return next();

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

  reportIsEmpty(req, res, next) {
    const { report } = req.body;
    if (report.trim().length < 10) {
      const error = new Error('Report must have at least ten characters');
      error.status = 400;
      return next(error);
    }
    return next();
  },

  reportIsRequired(req, res, next) {
    if ('report' in req.body) return next();
    const error = new Error('Report is required');
    error.status = 400;
    return next(error);
  },

  async checkIfUserAlreadyReported(req, res, next) {
    const { params: { slug } } = req;
    const { id: userId } = req.decoded;
    const article = await Article.findOne({ where: { slug } });
    const userHasPreviouslyReported = await Report.findOne({
      where: { articleId: article.id, userId }
    });

    if (userHasPreviouslyReported) {
      const error = new Error('Article already reported by you');
      error.status = 409;
      return next(error);
    }
    return next();
  },

  async doesBookmarkExist(req, res, next) {
    const {
      decoded: { id: userId },
      params: { slug },
      method
    } = req;

    const article = await Article.findOne({ where: { slug } });
    if (!article) {
      const error = new Error('Article does not exist!');
      error.status = 404;
      return next(error);
    }
    const articleId = article.id;
    const bookmark = await Bookmark.findOne({
      where: { articleId, bookmarkedBy: userId }
    });

    if (!bookmark && method === 'DELETE') {
      const error = new Error('This Article is not bookmarked!');
      error.status = 404;
      return next(error);
    }

    if (bookmark && method === 'POST') {
      const error = new Error('This Article is already bookmarked!');
      error.status = 401;
      return next(error);
    }

    return next();
  },

  async isInputValid(req, res, next) {
    const {
      title, body, description, category, coverImageUrl
    } = req.body;
    const inputArray = [title, body, description, category];
    if (coverImageUrl) inputArray.push(coverImageUrl);
    const errorMessage = 'Input types have to be string!';
    inputTypeValidator(isString, inputArray, errorMessage, next);
    return next();
  }
};
