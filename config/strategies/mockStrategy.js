import passport from 'passport';

const mockUser = {
  email: 'mockuser@gmail.com',
  firstName: 'Johnmock',
  lastName: 'Larry',
  imageUrl: 'https://mock.com/mock/image/url'
};

/**
 * @class Strategy
 */
class MockStrategy extends passport.Strategy {
  /**
   * Creates an instance of Strategy.
   * @param {*} options
   * @param {*} callback
   * @memberof Strategy
   */
  constructor(options, callback) {
    super(options, callback);
    this.name = options.name;
    this.callback = callback;
    this.redirectURL = options.redirectURL;
  }

  /**
   * @override
   * @returns {Function} - Callback function
   * @memberof Strategy
   */
  authenticate(req, options) {
    this.callback(null, null, mockUser, (error, user) => {
      if (options.scope) {
        this.redirect(this.redirectURL);
      } else {
        this.success(user);
      }
    });
  }
}

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
