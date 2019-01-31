import Sequelize from 'sequelize';
import models from '../models';

const { Article, Highlight } = models;
const { iLike } = Sequelize.Op;

export default {
  async highlightArticle(req, res) {
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

    await Highlight.create({
      articleId,
      userId,
      highlightedText,
      startIndex,
      stopIndex,
      comment
    });
    return res.sendStatus(201);
  },

  async getHighlight(req, res) {
    const { id } = req.params;
    const highlight = await Highlight.findOne({ where: { id } });
    return res.json({ highlight });
  },

  async removeHighlight(req, res) {
    const { id } = req.params;
    const highlight = await Highlight.findOne({ where: { id } });

    await highlight.destroy();
    return res.status(200).json({
      message: 'Highlight removed successfully'
    });
  },
};
