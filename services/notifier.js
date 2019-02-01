import models from '../models';
import pusherConfig from './pusherConfig';

const { Article, User, Notification } = models;

export default {
  async newCommentNotification(articleId, commenterId) {
    const article = await Article.findOne({ where: { id: articleId }, });
    const commenter = await User.findOne({ where: { id: commenterId } });
    const { userId, title } = article;
    const commenterName = commenter.username;

    const body = `${commenterName} just commented on your article: ${title}`;

    await Notification.create({ userId, body, status: 'unread' });

    pusherConfig.trigger('notification', userId, {});
  },

  async notifyFollowersOfNewArticle(followerId, authorId, articleTitle) {
    const author = await User.findOne({ where: { id: authorId } });

    const authorsName = author.username;
    const body = `${authorsName} just published an article: ${articleTitle}`;
    await Notification.create({ userId: followerId, body, status: 'unread' });

    pusherConfig.trigger('notification', followerId, {});
  }
};
