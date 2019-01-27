import Sequelize from 'sequelize';
import models from '../models';

const { Article, Comment } = models;
const { iLike } = Sequelize.Op;
const maxLen = 1000;

const isInputSupplied = (input, next) => {
  if (!input || typeof input !== 'string') {
    const error = new Error('comment params is missing, empty or invalid');
    error.status = 400;
    return next(error);
  }
};

const isCommentValid = (input, next) => {
  if (input.trim().length > maxLen) {
    const error = new Error(`comment is greater than ${maxLen} characters`);
    error.status = 400;
    return next(error);
  }
};

export default {
  isCommentSupplied(req, res, next) {
    const { comment } = req.body;
    isInputSupplied(comment, next);
    return next();
  },

  isNewCommentSupplied(req, res, next) {
    const { newComment } = req.body;
    isInputSupplied(newComment, next);
    return next();
  },

  isCommentValid(req, res, next) {
    const { comment } = req.body;
    isCommentValid(comment, next);
    return next();
  },

  isNewCommentValid(req, res, next) {
    const { newComment } = req.body;
    isCommentValid(newComment, next);
    return next();
  },

  async ensureArticleExists(req, res, next) {
    const article = await Article.findOne({
      where: { slug: { [iLike]: req.params.slug } }
    });
    if (!article) {
      const error = new Error('Article provided does not exist');
      error.status = 404;
      return next(error);
    }
    return next();
  }
};
