import Sequelize from 'sequelize';
import models from '../models';

const { Article, Highlight } = models;
const { iLike } = Sequelize.Op;

export default {
  async addHighlight(req, res) {
    const {
      params: { slug },
      decoded: { id: userId },
      body: {
        highlightedText,
        startIndex,
        stopIndex,
        comment
      }
    } = req;
    const article = await Article
      .findOne({ where: { slug: { [iLike]: slug } } });
    const articleId = article.id;

    const highlight = await Highlight.create({
      articleId,
      userId,
      highlightedText,
      startIndex,
      stopIndex,
      comment
    });
    return res.status(201).json({
      highlightedText: highlight.highlightedText,
      comment: highlight.comment,
      startIndex: highlight.startIndex,
      stopIndex: highlight.stopIndex,
      articleId: highlight.articleId
    });
  },

  async getAllHighlights(req, res) {
    const { decoded: { id: userId }, params: { slug } } = req;
    const article = await Article
      .findOne({ where: { slug: { [iLike]: slug } } });
    const articleId = article.id;
    const highlights = await Highlight
      .findOne({ where: { articleId, userId } });
    return res.json({ highlights });
  },

  async editHighlightComment(req, res) {
    const { params: { id }, decoded, body: { newComment } } = req;
    const highlightRow = await Highlight
      .findOne({ where: { id, userId: decoded.id } });
    await highlightRow.update({ comment: newComment });
    return res.json({ highlightRow });
  },

  async removeHighlight(req, res) {
    const { params: { id }, decoded } = req;
    const highlight = await Highlight
      .findOne({ where: { id, userId: decoded.id } });
    await highlight.destroy();
    return res.status(200).json({
      message: 'Highlight removed successfully'
    });
  },
};
