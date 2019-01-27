import passport from 'passport';
import util from 'util';

let strategyCallback;
let redirectURL;

const mockUser = {
  email: 'mockuser@gmail.com',
  firstName: 'Johnmock',
  lastName: 'Larry',
  imageUrl: 'https://mock.com/mock/image/url'
};

/**
 * @return {undefined}
 * @param {*} options
 * @param {*} callback
 */
function MockStrategy(options, callback) {
  this.name = options.name;
  strategyCallback = callback;
  ({ redirectURL } = options);
}

util.inherits(MockStrategy, passport.Strategy);

MockStrategy.prototype.authenticate = function auth(req, options) {
  strategyCallback(null, null, mockUser, (error, user) => {
    if (options.scope) {
      this.redirect(redirectURL);
    } else {
      this.success(user);
    }
  });
};

const googleMockStrategy = new MockStrategy({
  name: 'google',
  redirectURL: '/api/v1/users/google/redirect'
}, (accessToken, refreshToken, profile, done) => {
  done(null, profile);
});

const twitterMockStrategy = new MockStrategy({
  name: 'twitter',
  redirectURL: '/api/v1/users/twitter/redirect'
}, (accessToken, refreshToken, profile, done) => {
  done(null, profile);
});

const facebookMockStrategy = new MockStrategy({
  name: 'facebook',
  redirectURL: '/api/v1/users/facebook/redirect'
}, (accessToken, refreshToken, profile, done) => {
  done(null, profile);
});

export {
  googleMockStrategy,
  twitterMockStrategy,
  facebookMockStrategy
};
