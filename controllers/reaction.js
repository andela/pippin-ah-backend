import Sequelize from 'sequelize';
import models from '../models';

const { iLike } = Sequelize.Op;
const { Article, Reaction } = models;

export default {

  async like(req, res) {
    const article = await Article.findOne({
      where: { slug: { [iLike]: req.params.slug } }
    });
    const oldReaction = await Reaction.findOne({
      where: {
        articleId: article.id,
        likedOrDislikedBy: req.decoded.id,
      }
    });
    if (oldReaction) {
      await oldReaction.update({
        liked: true,
        disliked: false
      });
      return res.sendStatus(200);
    }
    await Reaction.create({
      articleId: article.id,
      likedOrDislikedBy: req.decoded.id,
      liked: true,
      disliked: false
    });
    return res.sendStatus(200);
  },

  async cancelReaction(req, res) {
    const article = await Article.findOne({
      where: { slug: { [iLike]: req.params.slug } }
    });
    const oldReaction = await Reaction.findOne({
      where: {
        articleId: article.id,
        likedOrDislikedBy: req.decoded.id,
      }
    });
    if (oldReaction) {
      await oldReaction.update({
        liked: false,
        disliked: false
      });
      return res.sendStatus(200);
    }
    await Reaction.create({
      articleId: article.id,
      likedOrDislikedBy: req.decoded.id,
      liked: false,
      disliked: false
    });
    return res.sendStatus(200);
  },

  async dislike(req, res) {
    const article = await Article.findOne({
      where: { slug: { [iLike]: req.params.slug } }
    });
    const oldReaction = await Reaction.findOne({
      where: {
        articleId: article.id,
        likedOrDislikedBy: req.decoded.id,
      }
    });
    if (oldReaction) {
      await oldReaction.update({
        liked: false,
        disliked: true
      });
      return res.sendStatus(200);
    }
    await Reaction.create({
      articleId: article.id,
      likedOrDislikedBy: req.decoded.id,
      liked: false,
      disliked: true
    });
    return res.sendStatus(200);
  }

};
