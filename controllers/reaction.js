import Sequelize from 'sequelize';
import models from '../models';

const { iLike } = Sequelize.Op;
const { Article, Reaction, Commentreaction } = models;

const setReaction = async (liked, disliked, slug, userId) => {
  const article = await Article.findOne({
    where: { slug: { [iLike]: slug } }
  });
  const oldReaction = await Reaction.findOne({
    where: {
      articleId: article.id,
      likedOrDislikedBy: userId,
    }
  });
  if (oldReaction) {
    await oldReaction.update({ liked, disliked });
    return;
  }
  await Reaction.create({
    articleId: article.id,
    likedOrDislikedBy: userId,
    liked,
    disliked
  });
};

const setCommentReaction = async (liked, disliked, commentId, userId) => {
  const oldCommentReaction = await Commentreaction.findOne({
    where: {
      commentId,
      commentLikedBy: userId,
    }
  });
  if (oldCommentReaction) {
    await oldCommentReaction.update({ liked: disliked });
    return;
  }
  await Commentreaction.create({
    commentId,
    commentLikedBy: userId,
    liked,
    disliked
  });
};


export default {
  async like(req, res) {
    await setReaction(true, false, req.params.slug, req.decoded.id);
    return res.sendStatus(200);
  },

  async cancelReaction(req, res) {
    await setReaction(false, false, req.params.slug, req.decoded.id);
    return res.sendStatus(200);
  },

  async dislike(req, res) {
    await setReaction(false, true, req.params.slug, req.decoded.id);
    return res.sendStatus(200);
  },
  async likeComment(req, res) {
    await setCommentReaction(true, false, req.params.commentId, req.decoded.id);
    return res.sendStatus(200);
  },
  async dislikeComment(req, res) {
    await setCommentReaction(false, true, req.params.commentId, req.decoded.id);
    return res.sendStatus(200);
  },
};
