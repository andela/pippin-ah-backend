import models from '../models';

const { User, Request } = models;

export default {
  async approveRequest(req, res) {
    const { params: { id }, decoded } = req;
    const foundUser = await User.findOne({ where: { id: decoded.id } });
    await foundUser.update({ isMentor: true });

    const foundRequest = await Request.findOne({ where: { id } });

    await foundRequest.update({ status: 'approved' });
    return res.sendStatus(200);
  },

  async rejectRequest(req, res) {
    const { params: { id } } = req;
    const foundRequest = await Request.findOne({ where: { id } });

    await foundRequest.update({ status: 'rejected' });
    return res.sendStatus(200);
  },

  async requestToBeMentor(req, res) {
    const request = 'Request to be a mentor';
    const response = await Request.create({
      userId: req.decoded.id,
      request,
      status: 'pending'
    });

    const admins = await User.findAll({
      where: { isAdmin: true },
      attributes: ['email']
    });

    const adminArray = admins.map(admin => admin.email);
    console.log('>>>>>>>>>>>>>>>>>>>', adminArray);

    return res.send({
      message: 'Your request to be a mentor has been sent',
      id: response.id
    });
  }

};
