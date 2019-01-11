import validation from 'validator';
import models from '../models';

const { user } = models;
/**
 * @class userValidation
 */
class userValidations {
  /**
    * Controls signup validation.
    * @constructor
    * @param {object} req - The request object.
    * @param {object} res - The response object.
    * @param {func}  next - The next middleware or function.
    */
  static signup(req, res, next) {
    if (validation.isEmail(req.body.email)) {
      user.findOne({ where: { email: req.body.email } })
        .then((users) => {
          if (users) {
            return res.status(400).send(
              { message: 'Email already in Use, No duplicate emails' });
          }
        })
        .catch(() => res.status(500).json(
          { message: 'Internal server error' }));
    }

    if (!req.body.username
       && !req.body.email
       && !req.body.password
    ) {
      return res.status(400).send({ message: 'All fields are required' });
    }
    if (!validation.isEmail(req.body.email)) {
      return res.status(400).send(
        { message: 'please Enter a valid Email' });
    }

    if (req.body.username === ''
    || typeof req.body.username
     === 'undefined'
    || req.body.username === null) {
      return res.status(400).send({ message: 'username field is required' });
    }
    if (!validation.isAlphanumeric(req.body.username)) {
      return res.status(400).send(
        { message: 'username must contain only alphabets and numbers' });
    }
    if (req.body.username.length < 6) {
      return res.status(400).send(
        { message: 'Your username must be at least 6 characters' });
    }

    if (req.body.password.length < 8) {
      return res.status(400).send(
        { message: 'Your password must be at least 8 characters' });
    }
    if (!validation.isAlphanumeric(req.body.password)) {
      return res.status(400).send(
        { message: 'password must contain only numbers and alphabet' });
    }

    next();
  }
}

export default userValidations;
