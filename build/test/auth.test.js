'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiHttp2.default);

describe('AUTHENTICATION TEST SUITE', function () {
  before(function () {
    return _models2.default.sequelize.sync({ force: true });
  });

  describe('JWT AUTHENTICATION', function () {
    it('should return a token on successful registration', function (done) {
      var newUser2 = {
        username: 'ebenezer',
        email: 'ebenezer@gmail.com',
        password: 'secretstuff'
      };
      _chai2.default.request(_app2.default).post('/api/v1/users').send(newUser2).end(function (err, res) {
        (0, _chai.expect)(res.body.token).to.not.equal(undefined);
        done();
      });
    });
    it('should return a token on successful login', function (done) {
      var newUser2 = {
        usernameOrEmail: 'ebenezer',
        password: 'secretstuff'
      };
      _chai2.default.request(_app2.default).post('/api/v1/users/login').send(newUser2).end(function (err, res) {
        (0, _chai.expect)(res.body.token).to.not.equal(undefined);
        done();
      });
    });
  });
});
//# sourceMappingURL=auth.test.js.map