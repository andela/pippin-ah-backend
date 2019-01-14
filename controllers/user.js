import Sequelize from 'sequelize';

import 'babel-polyfill';
import models from '../models';


const { iLike, or } = Sequelize.Op;
const { User } = models;

/**
 * @class
 */
class Users {
/**
    * Represents getUser controller
    * @constructor
    * @param {object} req - The request object.
    * @param {object} res - The response object.
    */
  static async getUser(req, res) {
    const user = await User.findOne({ where: { id: req.params.userId } });
    // eslint-disable-next-line no-unused-expressions
    !user ? res.status(404).json({ message: `No user with userId ${req.params.userId}, Please make sure you have the correct userId.` }) : res.status(200).json({ message: 'success', user });
  }

  /**
    * Controll update a user.
    * @constructor
    * @param {object} req - The request object.
    * @param {object} res - The response object.
    */
  static updateUser(req, res) {
    User.findByPk(req.params.userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: 'User Not Found'
          });
        }

        return user
          .update({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
          })
          .then(updatedUser => res.status(200).json({
            updatedUser,
            message: 'User Has been updated'
          }))
          .catch(error => res.status(400).send(error));
      });
  }

  /**
    * Represents a controller.
    * @constructor
    * @param {object} req - The request object.
    * @param {object} res - The response object.
    * @param {object} next - The response object.
    */
  static async login(req, res) {
    const { usernameOrEmail, password } = req.body;
    const loginUser = await User
      .findOne({
        where: {
          [or]: [
            { username: { [iLike]: usernameOrEmail } },
            { email: { [iLike]: usernameOrEmail } }
          ]
        }
      });
    await loginUser.validPassword(password);
    return res.status(200).json({ message: 'Login was successful' });
  }

  /**
    * Represents a controller.
    * @constructor
    * @param {object} req - The request object.
    * @param {object} res - The response object.
    */
  static async register(req, res) {
    const { username, email, password } = req.body;
    const userCreated = await User
      .create({
        username,
        email,
        password
      });
    if (userCreated) {
      return res.status(201).json({
        username: userCreated.username,
        email: userCreated.email

      });
    }
  }
}

export default Users;
