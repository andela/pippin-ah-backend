import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';


export default {

  init() {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: '/api/v1/users/google/redirect'
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }));
  },

  authenticate: passport.authenticate(
    'google', { scope: ['profile', 'email'] }
  ),

  redirect: passport.authenticate('google',
    {
      failureRedirect: '/api/v1/users/login',
      session: false
    }),

  onAuthSuccess: (req, res) => {
    console.log(req.user);
    res.send('You have successfully logged in');
  }

};
