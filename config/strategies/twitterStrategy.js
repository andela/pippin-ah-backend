import passport from 'passport';
import Strategy from 'passport-twitter';
import Users from '../../controllers';

const { processTwitterUser } = Users;

export default {

  init() {
    passport.use(new Strategy({
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: '/api/v1/users/twitter/redirect',
      includeEmail: true
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(process.env.TWITTER_CONSUMER_KEY);
      console.log('==========', profile);
      console.log('==========', profile.id);
      console.log('***==========', profile.email);
      done(null, {
        email: profile.email
      });
    }));
  },

  twitterAuthenticate: passport.authenticate(
    'twitter', { scope: ['include_email =true'] }
  ),

  twitterRedirect: passport.authenticate('twitter',
    {
      failureRedirect: '/api/v1/users/twitter/redirect',
      session: false
    }),

  twitterOnAuthSuccess: processTwitterUser

};

console.log(Strategy);
console.log(processTwitterUser);
