import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import { Users } from '../../controllers';
import { facebookMockStrategy } from './mockStrategy';

const { processSocialUser } = Users;

const strategy = new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: `${process.env.CLIENT_PORT}/auth?facebook`,
  profileFields: ['id', 'emails', 'name']
},
(accessToken, refreshToken, profile, done) => {
  done(null, { email: profile.emails[0].value });
});

const isTest = process.env.NODE_ENV === 'test';

export default {
  init() {
    passport.use(isTest ? facebookMockStrategy : strategy);
  },

  fbAuthenticate: passport.authenticate(
    'facebook', { scope: ['email'] }
  ),

  fbRedirect: passport.authenticate('facebook',
    {
      failureRedirect: '/api/v1/users/',
      session: false
    }),

  fbOnAuthSuccess: processSocialUser,

};
