import passport from 'passport';
import Strategy from 'passport-twitter';
import { Users } from '../../controllers';
import MockStrategy from './mockStrategy';

const { processSocialUser } = Users;

let strategy = new Strategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: '/api/v1/users/twitter/redirect',
  includeEmail: true
},
(accessToken, refreshToken, profile, done) => {
  done(null, {
    email: profile.emails[0].value,
    imageUrl: profile.photos[0].value
  });
});

if (process.env.NODE_ENV === 'test') {
  strategy = new MockStrategy({
    name: 'twitter',
    redirectURL: '/api/v1/users/twitter/redirect'
  }, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  });
}

export default {
  init() {
    passport.use(strategy);
  },

  twitterAuthenticate: passport.authenticate(
    'twitter', { scope: ['include_email =true'] }
  ),

  twitterRedirect: passport.authenticate('twitter',
    {
      failureRedirect: '/api/v1/users/twitter/redirect',
      session: false
    }),

  twitterOnAuthSuccess: processSocialUser
};
