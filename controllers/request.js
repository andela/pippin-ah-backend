import models from '../models';
import sendEmail from '../services';
import { emailMessages } from '../helpers';

const { User, Request } = models;

export default {
  async approveRequest(req, res) {
    const { params: { id }, decoded } = req;
    const foundUser = await User.findOne({ where: { id: decoded.id } });
    await foundUser.update({ isMentor: true });

    const foundRequest = await Request.findOne({ where: { id } });

    await foundRequest.update({ status: 'approved' });

    const subject = 'LEARNGROUND REQUEST UPDATE';
    const { email, username } = foundUser;
    const html = emailMessages.acceptMentorshipMessage(username);
    sendEmail({ email, subject, html });

    return res.sendStatus(200);
  },

  async rejectRequest(req, res) {
    const { params: { id } } = req;
    const foundRequest = await Request.findOne({
      where: { id },
      include: {
        model: User,
        attributes: ['username', 'email']
      }
    });

    await foundRequest.update({ status: 'rejected' });

    const subject = 'LEARNGROUND REQUEST UPDATE';
    const { email, username } = foundRequest.User;
    const html = emailMessages.rejectMentorshipMessage(username);
    sendEmail({ email, subject, html });

    return res.sendStatus(200);
  },

  async requestToBeMentor(req, res) {
    const userId = req.decoded.id;
    const request = 'Request to be a mentor';
    const subject = 'MENTORSHIP REQUEST UPDATE';
    const response = await Request.create({ userId, request });

    const requester = await User.findOne({ where: { id: userId } });

    const html = emailMessages.requestMentorshipMessage(requester.username);

    const admins = await User.findAll({
      where: { isAdmin: true },
      attributes: ['email']
    });

    admins.forEach(admin => sendEmail({
      email: admin.email,
      subject,
      html
    }));

    return res.send({
      message: 'Your request to be a mentor has been sent',
      id: response.id
    });
  }
};
