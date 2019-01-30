import models from '../models';
import { sendNotification } from '.';

const { Article, User, Notification } = models;

/**
*class
*/
export default {
  /**
    * Represents a controller.
    * @constructor
    * @param {string} articleId - ID of the article.
    * @param {string} commenterId - ID of the user.
    */
  async notifyInApp(articleId, commenterId) {
    const article = await Article.findOne({ where: { id: articleId }, });
    const commenter = await User.findOne({ where: { id: commenterId } });
    const { userId, title } = article;
    const commenterName = commenter.username;

    const body = `${commenterName} just commented on your article: ${title}`;

    await Notification.create({ userId, body, status: 'unread' });

    sendNotification.trigger('commentNotification', userId, {});
  },

  /**
    * Represents a controller.
    * @constructor
    * @param {string} followerId - ID of the follower.
    * @param {string} authorId - ID of the author.
    * @param {string} articleTitle - Title of the article.
    */
  async notifyFollowers(followerId, authorId, articleTitle) {
    const author = await User.findOne({ where: { id: authorId } });

    const authorsName = author.username;
    const body = `${authorsName} just published an article: ${articleTitle}`;
    await Notification.create({ userId: followerId, body, status: 'unread' });

    sendNotification.trigger('commentNotification', followerId, {});
  }
};
