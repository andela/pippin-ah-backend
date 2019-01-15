import Sequelize from 'sequelize';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import 'babel-polyfill';
import models from '../models';

dotenv.config();
const { iLike, or } = Sequelize.Op;
const { User } = models;
const secret = process.env.SECRET_KEY;
const time = { expiresIn: '72hrs' };
const generateToken = payload => jwt.sign(payload, secret, time);

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
    const { id } = req.decoded;
    const user = await User.findOne({ where: { id } });
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
    const user = await User
      .findOne({
        where: {
          [or]: [
            { username: { [iLike]: usernameOrEmail } },
            { email: { [iLike]: usernameOrEmail } }
          ]
        }
      });
    await user.validPassword(password);

    const tokenPayload = {
      id: user.id,
      isMentor: user.isMentor
    };

    return res.status(200).json({
      message: 'Login was successful',
      token: generateToken(tokenPayload)
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
    const user = await User
      .create({
        username,
        email,
        password
      });

    const tokenPayload = {
      id: user.id,
      isMentor: user.isMentor
    };
    const token = generateToken(tokenPayload);

    return res.status(201).json({
      username: user.username,
      email: user.email,
      token
    });
  }

  /**
    * Represents a controller.
    * @constructor
    * @param {object} req - The request object.
    * @param {object} res - The response object.
    */
  static async processGoogleUser(req, res) {
    const { email } = req.user;

    const user = await User
      .findOne({ where: { email: { [iLike]: email } } });
    if (user) {
      const tokenPayload = {
        id: user.id,
        isMentor: user.isMentor
      };
      const token = generateToken(tokenPayload);
      return res.json({
        username: user.username,
        email: user.email,
        token
      });
    }

    const newUser = await User
      .create({ email });
    const tokenPayload = {
      id: newUser.id,
      isMentor: false
    };
    const token = generateToken(tokenPayload);
    return res.status(201).json({
      email: newUser.email,
      token
    });
  }
}

export default Users;
