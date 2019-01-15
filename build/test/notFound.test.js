'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiHttp2.default);

describe('404 TEST SUITE', function () {
  it('should reply with 404 error', function (done) {
    _chai2.default.request(_app2.default).get('/random-rounte').end(function (err, res) {
      (0, _chai.expect)(res).to.have.status(404);
      (0, _chai.expect)(res.body.error).to.equal('Route not found');
      done();
    });
  });
});