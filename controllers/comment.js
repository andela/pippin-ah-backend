import Sequelize from 'sequelize';
import moment from 'moment';
import models from '../models';

const { iLike } = Sequelize.Op;
const { Article, Comment } = models;

export default {
  async addComment(req, res) {
    const { params: { slug }, decoded: { id } } = req;
    const article = await Article.findOne({
      where: { slug: { [iLike]: slug } }
    });
    const currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
    const newComment = await Comment.create({
      userId: id,
      comment: { [currentTime]: req.body.comment },
      articleId: article.id
    });
    return res.json({
      comment: newComment.comment,
      id: newComment.id,
      updatedAt: newComment.updatedAt
    });
  }
};
