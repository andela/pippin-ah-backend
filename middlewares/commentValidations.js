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

  async doesArticleExist(req, res, next) {
    const article = await Article.findOne({
      where: { slug: { [iLike]: req.params.slug } }
    });
    if (!article) {
      const error = new Error('Article provided does not exist');
      error.status = 404;
      return next(error);
    }
    return next();
  },

  async doesCommentExist(req, res, next) {
    const { id } = req.params;
    const comment = await Comment.findOne({ where: { id } });
    if (!comment) {
      const error = new Error('Comment does not exist');
      error.status = 404;
      return next(error);
    }
    return next();
  },

  async validateUser(req, res, next) {
    const { params: { id }, decoded } = req;
    const usersComment = await Comment
      .findOne({ where: { id, userId: decoded.id } });
    if (!usersComment) {
      const error = new Error('You are not authorized to edit this comment');
      error.status = 401;
      return next(error);
    }
    return next();
  },

  async isCommentDuplicate(req, res, next) {
    const {
      body: { comment },
      decoded: { id: userId },
      params: { slug }
    } = req;

    const article = await Article.findOne({
      where: { slug },
      include: [{
        model: Comment,
        required: false,
        attributes: ['id', 'userId', 'comment']
      }]
    });

    const articleCommentsRaw = article.Comments;
    const articleComments = articleCommentsRaw.map(item => ({
      userId: item.userId,
      commentTexts: Object.values(item.comment)
    }));

    const identicalComment = articleComments.find(element => element
      .userId === userId && element.commentTexts.includes(comment.trim()));

    if (identicalComment) {
      const error = new Error('You\'ve already posted this comment');
      error.status = 400;
      return next(error);
    }
    return next();
  }

};
