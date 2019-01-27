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

export default MockStrategy;
