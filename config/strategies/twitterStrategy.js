import passport from 'passport';
import Strategy from 'passport-twitter';
import Users from '../../controllers';

const { processTwitterUser } = Users;

passport.use(new Strategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: '/api/v1/users/twitter/redirect'
},
(accessToken, refreshToken, profile, done) => {
  console.log(process.env.TWITTER_CONSUMER_KEY);
  console.log('==========', profile);
  done(null, {
    email: profile.email
  });
}));

const twitterAuthenticate = () => passport.authenticate('twitter');

console.log(Strategy);
console.log(processTwitterUser);

export default twitterAuthenticate;
