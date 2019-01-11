import passport from 'passport';
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
  static login(req, res, next) {
    passport.authenticate('local', { session: false }, (
      err,
      user
    ) => {
      if (err) {
        return next(err);
      }

      if (user) {
        return res.json({ message: 'Login was successful' });
      }
      return res.status(401).json('incorrect email or password');
    });
  }

  /**
    * Represents a controller.
    * @constructor
    * @param {object} req - The request object.
    * @param {object} res - The response object.
    */
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> [#162727552] refactor user validations
  static async register(req, res) {
    const { username, email, password } = req.body;
<<<<<<< HEAD
    const userResponse = await User.create({ username, email, password });
<<<<<<< HEAD

    return res.send({
      username: userResponse.username,
      email: userResponse.email
    });
=======
  static register(req, res) {
    const password = bcrypt.hashSync(req.body.password, 10);
    return User
      .create({
        username: req.body.username,
        email: req.body.email,
        password

      })
      .then(user => res.status(201).send({
        message: 'Your Registration sucessful',
        username: user.username,
        email: user.email
      }))
      .catch(() => res.status(500).send(
        { message: 'Internal server Error' }
      ));
>>>>>>> feat(descriptive error):create a userValidations.js
=======

    return res.send({
      username: userResponse.username,
      email: userResponse.email
    });
>>>>>>> [#162727552] refactor user validations
=======
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
>>>>>>> feat(descriptive errors): installs babel-polyfill on dependencies
  }
}

export default Users;
