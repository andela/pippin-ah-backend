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
      done(null, {
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        imageUrl: profile.photos[0].value
      });
    }));
  },

  authenticate: passport.authenticate(
    'google', { scope: ['profile', 'email'] }
  ),

  redirect: passport.authenticate('google',
    {
      failureRedirect: '/api/v1/users/google',
      session: false
    }),

  onAuthSuccess: processGoogleUser

};
