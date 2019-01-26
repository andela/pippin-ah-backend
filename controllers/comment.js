import Sequelize from 'sequelize';
import moment from 'moment';
import models from '../models';

const { iLike } = Sequelize.Op;
const { Article, Comment } = models;
const currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');

export default {
  async addComment(req, res) {
    const { params: { slug }, decoded } = req;
    const article = await Article
      .findOne({ where: { slug: { [iLike]: slug } } });
    const newComment = await Comment.create({
      userId: decoded.id,
      comment: { [currentTime]: req.body.comment },
      articleId: article.id
    });
    const comment = Object.values(newComment.comment)[0];
    const { id, updatedAt } = newComment;
    return res.json({ comment, id, updatedAt });
  },

  async editComment(req, res) {
    const { params: { id }, decoded, body: { newComment } } = req;
    const commentRow = await Comment
      .findOne({ where: { id, userId: decoded.id } });
    const { comment } = commentRow;
    comment[currentTime] = newComment;
    await commentRow.update({ comment });
    const updatedComment = Object.values(comment).slice(-1)[0];
    return res.json({ updatedComment });
  }
};
