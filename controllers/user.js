import Sequelize from 'sequelize';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sendEmail from '../services';
import models from '../models';
import { getResetMail } from '../helpers';

dotenv.config();
const { iLike, or } = Sequelize.Op;
const { User, Profile, Article } = models;

const secret = process.env.SECRET_KEY;
const time = { expiresIn: '72hrs' };
const generateToken = payload => jwt.sign(payload, secret, time);

const subject = 'Welcome to Learnground';
const userActivationUrl = process.env.NODE_ENV === 'development'
  ? `http://localhost:${process.env.PORT}/api/v1/user/activate/`
  : process.env.HEROKU_URL;

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
      isMentor: user.isMentor,
      isAdmin: user.isAdmin
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
    const {
      username,
      email,
      password,
      isMentor
    } = req.body;

    const user = await User
      .create({
        username,
        email,
        password,
        isMentor
      });

    const profile = new Profile();
    await profile.setUser(user);
    const tokenPayload = {
      id: user.id,
      isMentor: user.isMentor,
      isAdmin: user.isAdmin
    };
    const token = generateToken(tokenPayload);

    const activationUrl = `${userActivationUrl}${user.id}`;
    const html = `<h1 style=" text-align:justify";margin-left:50%;
          padding:15px">
          Welcome To LearnGround </h1><br>
          <h3 style=" text-align:justify";margin-left:50%>
            The Den Of Great Ideas
          </h3>
          <strong style=" text-align:justify";margin-left:50%>
          Your Registration was successful </strong><br>
          <strong style=" text-align:justify";margin-left:50%>
          Click <a href="${activationUrl}">Activate</a> to activate
          your account
          </strong><br>`;

    sendEmail({ email, subject, html });
    return res.status(201).json({
      message: 'An email has been sent to your email address',
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
        isMentor: user.isMentor,
        isAdmin: user.isAdmin
      };
      const token = generateToken(tokenPayload);
      return res.json({
        username: user.username,
        email: user.email,
        token
      });
    }
    const username = email.substring(0, email.indexOf('@')).replace('.', '')
            + Math.random().toString(36).replace('0.', '');
    const newUser = await User
      .create({ email, username, isActive: true });
    const profile = new Profile({ lastName, firstName, imageUrl });
    await newUser.setProfile(profile);
    const tokenPayload = {
      id: newUser.id,
      isMentor: false,
      isAdmin: newUser.isAdmin
    };
    const token = generateToken(tokenPayload);
    return res.status(201).json({
      email: newUser.email,
      token
    });
  }

  /**
    * Represents a controller.
    * @constructor
    * @param {object} req - The request object.
    * @param {object} res - The response object.
    */
  static async activateUser(req, res) {
    const user = await User.findOne({ where: { id: req.params.userId } });
    await user.update({ isActive: true });
    return res.json({
      message:
      'Your account has been activated. Login to continue using learnground'
    });
  }

  /**
    * Represents a controller.
    * @constructor
    * @param {object} req - The request object.
    * @param {object} res - The response object.
    */
  static async getAllAuthors(req, res) {
    const authors = await Article.findAll({
      include: [{
        model: User,
        attributes: ['username'],
        include: [
          {
            model: Profile,
            attributes: [
              'firstName',
              'lastName',
              'bio',
              'imageUrl',
              'interests'
            ]
          }
        ]
      }]
    });

    const responseArray = authors.map(item => ({
      author: item.User.username,
      firstName: item.User.Profile.firstName,
      lastName: item.User.Profile.lastName,
      bio: item.User.Profile.bio,
      image: item.User.Profile.imageUrl,
      interests: item.User.Profile.interests,
    }));

    return res.send(responseArray);
  }

  /**
    * Controll update a user.
    * @constructor
    * @param {object} req - The request object.
    * @param {object} res - The response object.
    */
  static async sendPasswordResetToken(req, res) {
    const { usernameOrEmail } = req.body;
    const user = await User
      .findOne({
        where: {
          [or]: [
            { username: { [iLike]: usernameOrEmail } },
            { email: { [iLike]: usernameOrEmail } }
          ]
        }
      });
    const mailHeader = 'LearnGround Password Reset';
    const resetMail = getResetMail(user.username, mailHeader, 'link');
    sendEmail({ email: user.email, subject: mailHeader, html: resetMail });
  }
}

export default Users;
