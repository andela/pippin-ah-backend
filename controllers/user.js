import bcrypt from 'bcrypt';
import 'babel-polyfill';
import models from '../models';

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
  static getUser(req, res) {
    User.findById(req.params.userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: 'User Not Found'
          });
        }
        return res.status(200).json({
          message: 'User Found',
          user
        });
      })
      .catch(error => res.status(400).send(error));
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
    const usernameOrEmail = (req.body.email)
      ? { email: req.body.email.toLowerCase() }
      : { username: req.body.username.toLowerCase() };
    const loginUser = await User
      .findOne({ where: usernameOrEmail });
    if (loginUser) {
      if (bcrypt.compareSync(req.body.password.toLowerCase(),

        loginUser.password)) {
        return res.status(200).json({
          message: 'Login was sucessful'
        });
      }
      return res.status(404).json({
        message: 'Invalid Credential'
      });
    }
    if (loginUser === null) {
      return res.status(404).json({
        message: 'Invalid Credential'
      });
    }
  }


  /**
    * Represents a controller.
    * @constructor
    * @param {object} req - The request object.
    * @param {object} res - The response object.
    */
  static async register(req, res) {
    let { username, email, password } = req.body;
    username = username.toLowerCase();
    email = email.toLowerCase();
    password = password.toLowerCase();
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
