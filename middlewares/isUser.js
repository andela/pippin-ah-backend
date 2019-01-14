/* eslint-disable no-trailing-spaces */
import models from '../models';

const { User } = models;

/**
 * class
*/
export default class {
  /**
     * Check if a user exist in the database
     * @constructor
     * @param {object} req - The request object
     * @param {Object} res - The response object
     * @param {object} next - Method to call another middleware
     */
  static async getUser(req, res, next) {
    const error = new Error('User not found');
    error.status = 404;
    const user = await User.findOne({ where: { id: req.params.userId } });
    // eslint-disable-next-line no-unused-expressions
    !user ? next(error) : next();
  }
}
