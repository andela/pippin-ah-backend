import models from '../models';

const { Notification } = models;

export default {
  async getAllNotifications(req, res) {
    const { id } = req.decoded;
    const notification = await Notification.findAll({
      where: { userId: id, status: 'unread' }
    });

    const responseObject = notification.map(item => ({
      body: item.body, notficationId: item.id, status: item.status
    }));

    return res.send(responseObject);
  },

  async markAsRead(req, res) {
    const {
      decoded: { id: userId },
      params: { notificationId }
    } = req;

    const notificationObject = await Notification.findOne({
      where: {
        userId,
        id: notificationId
      }
    });
    notificationObject.status = 'read';
    const response = await notificationObject.save();

    return res.send({
      status: response.status,
      createdAt: response.createdAt
    });
  }
};
