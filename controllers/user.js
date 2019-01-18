import Sequelize from 'sequelize';
import jwt from 'jsonwebtoken';
import 'babel-polyfill';
import models from '../models';

const { iLike, or } = Sequelize.Op;
const { User, Profile } = models;
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
    const user = await User.findOne(
      {
        where: { id },
        include: [{ model: Profile }]
      });
    const profile = user.Profile;
    return res.json({
      username: user.username,
      email: user.email,
      isMentor: user.isMentor,
      profile: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        bio: profile.bio,
        imageUrl: profile.imageUrl
      }
    });
  }

  /**
    * Controll update a user.
    * @constructor
    * @param {object} req - The request object.
    * @param {object} res - The response object.
    */
  static async updateUser(req, res) {
    const user = await User.findByPk(req.decoded.id);
    const userResponse = await user
      .update({
        username: req.body.username || user.username,
        email: req.body.email || user.email,
        password: req.body.password || user.password
      });

    const responseObject = {
      username: userResponse.username,
      email: userResponse.email,
      isMentor: userResponse.isMentor,
      message: 'User Updated Successfully'
    };

    return res.send(responseObject);
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
    const profile = new Profile();
    await profile.setUser(user);
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
  static async processSocialUser(req, res) {
    const {
      email, lastName, firstName, imageUrl
    } = req.user;

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
    const profile = new Profile({ lastName, firstName, imageUrl });
    await newUser.setProfile(profile);
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
