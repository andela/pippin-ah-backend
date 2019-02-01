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
      startIndex: Number(startIndex),
      stopIndex: Number(stopIndex),
      comment
    });
    return res.status(201).json({
      id: highlight.id,
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
      .findAll({ where: { articleId, userId } });
    if (highlights.length === 0) {
      return res.json({ message: 'You have no highlights yet!' });
    }
    return res.json({ highlights });
  },

  async removeHighlight(req, res) {
    const { params: { id }, decoded } = req;
    const highlight = await Highlight
      .findOne({ where: { id, userId: decoded.id } });
    await highlight.destroy();
    return res.status(200).json({
      message: 'Highlight removed successfully!'
    });
  }
};
