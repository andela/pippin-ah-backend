import Sequelize from 'sequelize';

import 'babel-polyfill';
import models from '../models';
import { generateToken } from '../middlewares/authentication';


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
    * @param {object} next -The next middleware
    */
  static async getUser(req, res) {
    const user = await User.findOne({ where: { id: req.params.userId } });
    return res.json({
      username: user.username,
      email: user.email,
      isMentor: user.isMentor,
    });
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
    const { id, isMentor } = loginUser;
    return res.status(200).json({
      message: 'Login was successful',
      token: generateToken([id, isMentor])
    });
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
    const { id, isMentor } = userCreated;
    return res.status(201).json({
      username: userCreated.username,
      email: userCreated.email,
      token: generateToken([id, isMentor])
    });
  }
}

export default Users;
