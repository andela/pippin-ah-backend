import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { Users } from '../../controllers';
import { googleMockStrategy } from './mockStrategy';

const { processSocialUser } = Users;

const strategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: `${process.env.CLIENT_PORT}/auth?google`
}, (accessToken, refreshToken, profile, done) => {
  done(null, {
    email: profile.emails[0].value,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    imageUrl: profile.photos[0].value
  });
});

const isTest = process.env.NODE_ENV === 'test';

export default {
  init() {
    passport.use(isTest ? googleMockStrategy : strategy);
  },

  googleAuthenticate: passport.authenticate(
    'google', { scope: ['profile', 'email'] }),

  googleRedirect: passport.authenticate('google',
    {
      failureRedirect: '/api/v1/users/google',
      session: false
    }),

  googleOnAuthSuccess: processSocialUser
};
