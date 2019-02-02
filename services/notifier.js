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
  },

  async notifyOfNewFollower(followedId, followerName) {
    const body = `${followerName} has started following you`;
    await Notification.create({ userId: followedId, body, status: 'unread' });
    pusherConfig.trigger('notification', followedId, { body });
  },

  async notifyAdminsOfRequest(requesterName, admins) {
    const body = `${requesterName} has just requested to be a mentor`;
    const adminsNotificationObject = admins.map(admin => ({
      userId: admin.id,
      body,
      status: 'unread'
    }));
    await Notification.bulkCreate(adminsNotificationObject);
    admins.map((admin => pusherConfig.trigger('notification', admin.id, body)));
  },

  async notifyOfRequestStatus(requesterId, status) {
    const body = `Your request to be a mentor has been ${status}`;
    await Notification.create({ userId: requesterId, body, status: 'unread' });
    pusherConfig.trigger('notification', requesterId, body);
  }
};
