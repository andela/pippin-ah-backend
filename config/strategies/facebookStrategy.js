import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import { Users } from '../../controllers';
import MockStrategy from './mockStrategy';

const { processSocialUser } = Users;

let strategy = new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL:
  `${process.env.FACEBOOK_CALLBACK}/api/v1/users/facebook/redirect`,
  profileFields: ['id', 'emails', 'name']
},
(accessToken, refreshToken, profile, done) => {
  done(null, { email: profile.emails[0].value });
});

if (process.env.NODE_ENV === 'test') {
  strategy = new MockStrategy({
    name: 'facebook',
    redirectURL: '/api/v1/users/facebook/redirect'
  }, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  });
}

export default {
  init() {
    passport.use(strategy);
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
