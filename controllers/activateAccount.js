import dotenv from 'dotenv';
import 'babel-polyfill';
import models from '../models';

dotenv.config();

const { User } = models;

/**
 * @class
 */
class Activate {
  /**
    * Represents a controller.
    * @constructor
    * @param {object} req - The request object.
    * @param {object} res - The response object.
    */
  static async activateUser(req, res) {
    const user = await User.findOne({
      where: { id: req.params.userId }
    });
    const userAcctivation = await user
      .update({
        isActive: true
      });
    return res.json({
      message: `${userAcctivation.username} your account has been activated`,
    });
  }
}

export default Activate;
