import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import Users from '../../controllers';

const { processGoogleUser } = Users;

export default {

  init() {
    passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: 'http://localhost:3000/api/v1/users/facebook/redirect',
      profileFields: ['id', 'emails', 'name']
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('Profile', profile);
      done(null, { email: profile.emails[0].value });
    }));
  },

  fbAuthenticate: passport.authenticate(
    'facebook', { scope: ['email'] }
  ),

  fbRedirect: passport.authenticate('facebook',
    {
      failureRedirect: '/api/v1/users/',
      session: false
    }),

  fbOnAuthSuccess: processGoogleUser,

};
