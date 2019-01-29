import models from '../models';

const { User, Request } = models;

export default {
  async approveRequest(req, res) {
    const { params: { id }, decoded: { isAdmin } } = req;
    if (isAdmin) {
      const foundUser = await User
        .findOne({ where: { id } });
      await foundUser
        .update({
          isMentor: true
        });
      const foundRequest = await Request
        .fineOne({ where: { id } });

      await foundRequest
        .update({
          status: 'approved'
        });
      return res.sendStatus(200);
    }
  },
  async requestToBeMentor(req, res) {
    const request = 'Request to be a mentor';
    await Request.create({
      userId: req.decoded.id,
      request,
      status: 'pending'
    });
    return res.send({ message: 'Your request to be a mentor has been sent' });
  }

};
