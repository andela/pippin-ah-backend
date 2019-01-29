import models from '../models';

const { Request } = models;

export default {
  async requestToBeMentor(req, res) {
    const request = 'Request to be a mentor';
    await Request.create({
      userId: req.decoded.id,
      request,
      status: 'pending'
    });
    return res.send({ message: 'Your mentorship request has been sent' });
  }
};
