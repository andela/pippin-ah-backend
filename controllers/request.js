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
  }

};
