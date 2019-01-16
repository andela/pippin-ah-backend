import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import Users from '../../controllers';

const { processGoogleUser } = Users;

export default {

  init() {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: '/api/v1/users/google/redirect'
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, { email: profile.emails[0].value });
    }));
  },

  googleAuthenticate: passport.authenticate(
    'google', { scope: ['profile', 'email'] }
  ),

  googleRedirect: passport.authenticate('google',
    {
      failureRedirect: '/api/v1/users/google',
      session: false
    }),

  googleOnAuthSuccess: processGoogleUser

};
