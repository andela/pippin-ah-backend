'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var secret = process.env.SECRET_KEY;
var verifyToken = function verifyToken(req, res, next) {
  var token = req.headers.authorization;

  _jsonwebtoken2.default.verify(token, secret, function (err, decoded) {
    var error = void 0;
    if (!token) {
      error = new Error('No token provided');
      error.status = 400;
      return next(error);
    }
    if (err) {
      error = new Error('Invalid token');
      error.status = 401;
      return next(error);
    }

    req.decoded = decoded;
    return next();
  });
};

exports.default = verifyToken;