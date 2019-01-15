import passport from 'passport';
import passportGoogle from 'passport-google-oauth';

export default {

  config() {
    const GoogleStrategy = passportGoogle.OAuth2Strategy;
    passport.use(new GoogleStrategy({
      clientID: '1072047676773-9me877aptv1ieau17vh0istko2cu0911.apps.googleusercontent.com',
      clientSecret: 'FZhvENs8ywRiV6NYfs_6V3WY',
      callbackURL: 'http://localhost:5017/api/v1/users/google/redirect'
    },
    ((accessToken, refreshToken, profile, done) => {
      console.log(profile);
      return done(null, { user: 'user' });
    })
    ));
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
    res.send('You have successfully logged in');
  }

};
