import models from '../models';

const { user } = models;
/**
 * @class userValidation
 */
class userValidations {
  /**
    * Controll signup validation.
    * @constructor
    * @param {object} req - The request object.
    * @param {object} res - The response object.
    * @param {func}  next - The next middleware or function.
    */
  static signup(req, res, next) {
    const usernamecharTest = /[^a-zA-Z/\s/-]/g;
    const validEmail = /[a-zA-Z0-9]+@[a-z]+\.[com]+/;
    const usernameTest = /[a-zA-Z]/g;
    const passwordChar = /[a-zA-Z]/g;
    const passwordNumb = /[0-9]/g;
    const passwordTest = /[^\S]/g;
    let str1, str2, str3;

    if (req.body.email) {
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
    if (!validEmail.test(req.body.email)) {
      return res.status(400).send(
        { message: 'please Enter a valid Email' });
    }

    if (req.body.username) {
      str1 = req.body.username;
      str2 = str1.trim();
      str3 = str2.replace(/\s\s+/g, '');
    }
    if (req.body.username === ''
    || typeof req.body.username
     === 'undefined'
    || req.body.username === null) {
      return res.status(400).send({ message: 'username field is required' });
    }
    if (str3.length < 4) {
      return res.status(400).send(
        { message: 'username field needs additional characters' });
    }
    if (!usernameTest.test(req.body.username)) {
      return res.status(400).send(
        { message: 'username must contain at least one character' });
    }
    if (req.body.username.length < 6) {
      return res.status(400).send(
        { message: 'Your username must be at least 6 characters' });
    }
    if (usernamecharTest.test(req.body.username)) {
      return res.status(400).send(
        { message: 'username must be alphabetic, can contain spaces and "-"' });
    }
    if (req.body.password === ''
    || typeof req.body.password === 'undefined'
    || req.body.password === null || passwordTest.test(req.body.password)) {
      return res.status(400).send(
        {
          message:
          'password is required and must not contain space character'
        });
    }
    if (req.body.password.length < 8) {
      return res.status(400).send(
        { message: 'Your password must be at least 8 characters' });
    }
    if (!passwordChar.test(req.body.password)) {
      return res.status(400).send(
        { message: 'password must contain at least 1 character' });
    }
    if (!passwordNumb.test(req.body.password)) {
      return res.status(400).send(
        { message: 'password must contain at least 1 number' });
    }
    next();
  }
}

export default userValidations;
