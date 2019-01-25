import Sequelize from 'sequelize';
import models from '../models';

const { Article } = models;
const { iLike } = Sequelize.Op;
const maxLen = 1000;

export default {
  ensureCommentInput(req, res, next) {
    const { comment } = req.body;
    if (!comment || typeof comment !== 'string') {
      const error = new Error('comment params is missing, empty or invalid');
      error.status = 400;
      return next(error);
    }
    return next();
  },

  ensureValidComment(req, res, next) {
    const { comment } = req.body;
    if (comment.trim().length > maxLen) {
      const error = new Error(`comment is greater than ${maxLen} characters`);
      error.status = 400;
      return next(error);
    }
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
