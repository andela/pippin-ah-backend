import passport from 'passport';
import util from 'util';

let strategyCallback;
let redirectURL;

const mockUser = {
  id: '5534522347',
  displayName: 'Jesse Init',
  username: 'jesseinit',
  emails: [{ value: 'jesseinit@now.com' }],
  photos: [{ value: 'https://imgur.com/jesse.jpg' }],
  provider: 'mock'
};

/**
 * @return {undefined}
 * @param {*} options
 * @param {*} callback
 */
function MockStrategy(options, callback) {
  this.name = options.name;
  strategyCallback = callback;
  ({ redirectURL } = redirectURL);
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

export default MockStrategy;
