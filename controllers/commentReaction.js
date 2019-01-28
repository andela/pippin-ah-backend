import models from '../models';

const { CommentReaction } = models;


const setCommentReaction = async (liked, disliked, commentId, userId) => {
  const oldCommentReaction = await CommentReaction.findOne({
    where: {
      commentId,
      commentLikedBy: userId,
    }
  });
  if (oldCommentReaction) {
    await oldCommentReaction.update({ liked: disliked });
    return;
  }
  await CommentReaction.create({
    commentId,
    commentLikedBy: userId,
    liked,
    disliked
  });
};


export default {
  async likeComment(req, res) {
    await setCommentReaction(true, false, req.params.commentId, req.decoded.id);
    return res.sendStatus(200);
  },

  async dislikeComment(req, res) {
    await setCommentReaction(false, true, req.params.commentId, req.decoded.id);
    return res.sendStatus(200);
  },
};
