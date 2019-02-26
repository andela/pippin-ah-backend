import passport from 'passport';
import TwitterTokenStrategy from 'passport-twitter-token';
import { Users } from '../../controllers';
import { twitterMockStrategy } from './mockStrategy';

const { processSocialUser } = Users;

const strategy = new TwitterTokenStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: 'http://127.0.0.1/auth',
  includeEmail: true
},
(accessToken, refreshToken, profile, done) => {
  done(null, {
    email: profile.emails[0].value,
    imageUrl: profile.photos[0].value
  });
});

const isTest = process.env.NODE_ENV === 'test';

export default {
  init() {
    passport.use(isTest ? twitterMockStrategy : strategy);
  },

  twitterTokenAuth: passport.authenticate(
    'twitter-token', { session: false }
  ),

  twitterOnAuthSuccess: processSocialUser
};
