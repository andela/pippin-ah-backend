import passport from 'passport';
import User from '../models';

const LocalStrategy = require('passport-local').Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'user[email]',
      passwordField: 'user[password]'
    },
    ((username, password, done) => {
      User.findOne({ username }, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    })
  ));
