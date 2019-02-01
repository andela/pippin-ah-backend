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
    const { email } = foundUser;
    const userName = foundUser.username;
    const html = emailMessages.acceptMentorshipMessage(userName);
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
    const { email } = foundRequest.User;
    const userName = foundRequest.User.username;
    const html = emailMessages.rejectMentorshipMessage(userName);
    sendEmail({ email, subject, html });

    return res.sendStatus(200);
  },

  async requestToBeMentor(req, res) {
    const userId = req.decoded.id;
    const request = 'Request to be a mentor';
    const status = 'pending';
    const subject = 'MENTORSHIP REQUEST UPDATE';
    const response = await Request.create({ userId, request, status });

    const requestUser = await User.findOne({ where: { id: userId } });

    const requestUsername = requestUser.username;
    const requestMentorshipMessage = emailMessages
      .requestMentorshipMessage(requestUsername);

    const admins = await User.findAll({
      where: { isAdmin: true },
      attributes: ['email']
    });

    const adminEmailArray = admins.map(admin => admin.email);
    adminEmailArray.forEach(email => sendEmail({
      email,
      subject,
      html: requestMentorshipMessage
    }));

    return res.send({
      message: 'Your request to be a mentor has been sent',
      id: response.id
    });
  }

};
