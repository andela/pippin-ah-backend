import Sequelize from 'sequelize';
import moment from 'moment';
import models from '../models';

const { iLike } = Sequelize.Op;
const { Article, Comment } = models;

export default {
  async addComment(req, res) {
    const currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
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
    const currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
    const { params: { id }, decoded, body: { newComment } } = req;
    const commentRow = await Comment
      .findOne({ where: { id, userId: decoded.id } });
    const { comment } = commentRow;
    comment[currentTime] = newComment;
    await commentRow.update({ comment });
    const updatedComment = Object.values(comment).slice(-1)[0];
    return res.json({ updatedComment });
  },

  async getComment(req, res) {
    const { id } = req.params;
    const commentRow = await Comment.findOne({ where: { id } });
    const { comment } = commentRow;
    const latestEdit = Object.values(comment).slice(-1)[0];
    return res.json({ comment: latestEdit });
  },

  async getCommentEditHistory(req, res) {
    const { id } = req.params;
    const commentRow = await Comment.findOne({ where: { id } });
    const { comment } = commentRow;
    return res.json({ comment });
  },

  async deleteComment(req, res) {
    const { params: { id }, decoded } = req;
    const comment = await Comment
      .findOne({ where: { id, userId: decoded.id } });
    await comment.destroy();
    return res.status(204).json({
      message: 'Comment deleted successfully'
    });
  }
};
