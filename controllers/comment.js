import Sequelize from 'sequelize';
import models from '../models';

const { iLike } = Sequelize.Op;
const { Article, Comment } = models;

export default {
  async addComment(req, res) {
    const article = await Article.findOne({
      where: { slug: { [iLike]: req.params.slug } }
    });
    const newComment = await Comment.create({
      userId: req.decoded.id,
      comment: req.body.comment,
      articleId: article.id
    });
    return res.json({
      comment: newComment.comment,
      id: newComment.id,
      updatedAt: newComment.updatedAt
    });
  }
};
