'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _Sequelize$Op = _sequelize2.default.Op,
    iLike = _Sequelize$Op.iLike,
    or = _Sequelize$Op.or;
var User = _models2.default.User;


var requiredParams = ['username', 'email', 'password'];
var nonEmptyParams = ['username', 'email', 'password'];

exports.default = {
  expectedParamsValidator: function expectedParamsValidator(req, res, next) {
    var errorArray = [];

    requiredParams.forEach(function (param) {
      if (!Object.keys(req.body).includes(param)) {
        errorArray.push(param + ' is required');
      }
    });

    if (!errorArray.length) {
      return next();
    }

    var errorMessage = JSON.stringify(errorArray);
    var error = new Error(errorMessage);
    error.status = 400;
    return next(error);
  },
  nonEmptyParamsValidator: function nonEmptyParamsValidator(req, res, next) {
    var errorArray = [];

    nonEmptyParams.forEach(function (param) {
      if (!req.body[param].trim().length) {
        errorArray.push(param + ' must not be empty');
      }
    });

    if (!errorArray.length) {
      return next();
    }

    var errorMessage = JSON.stringify(errorArray);
    var error = new Error(errorMessage);
    error.status = 400;
    return next(error);
  },
  emailExistsValidator: function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
      var email, used, error;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              email = req.body.email;
              _context.next = 3;
              return User.findOne({ where: { email: (0, _defineProperty3.default)({}, iLike, email) } });

            case 3:
              used = _context.sent;

              if (!used) {
                _context.next = 8;
                break;
              }

              error = new Error('Email already in use');

              error.status = 409;
              return _context.abrupt('return', next(error));

            case 8:
              next();

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function emailExistsValidator(_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    }

    return emailExistsValidator;
  }(),
  usernameExistsValidator: function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res, next) {
      var username, usernameIsInUse, error;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              username = req.body.username;
              _context2.next = 3;
              return User.findOne({ where: { username: (0, _defineProperty3.default)({}, iLike, username) } });

            case 3:
              usernameIsInUse = _context2.sent;

              if (!usernameIsInUse) {
                _context2.next = 8;
                break;
              }

              error = new Error('Username already in use');

              error.status = 409;
              return _context2.abrupt('return', next(error));

            case 8:
              next();

            case 9:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function usernameExistsValidator(_x4, _x5, _x6) {
      return _ref2.apply(this, arguments);
    }

    return usernameExistsValidator;
  }(),
  emailIsValid: function emailIsValid(req, res, next) {
    if (!_validator2.default.isEmail(req.body.email)) {
      var error = new Error('please Enter a valid Email');
      error.status = 400;
      return next(error);
    }
    next();
  },
  usernameValidator: function usernameValidator(req, res, next) {
    if (!_validator2.default.isAlphanumeric(req.body.username)) {
      var error = new Error('username must contain only alphabets and numbers');
      error.status = 400;
      return next(error);
    }

    if (req.body.username.length < 6) {
      var _error = new Error('Your username must be at least 6 characters');
      _error.status = 400;
      return next(_error);
    }
    next();
  },
  passwordValidator: function passwordValidator(req, res, next) {
    if (!_validator2.default.isAlphanumeric(req.body.password)) {
      var error = new Error('password must contain only numbers and alphabet');
      error.status = 400;
      return next(error);
    }
    if (req.body.password.length < 8) {
      var _error2 = new Error('Your password must be at least 8 characters');
      _error2.status = 400;
      return next(_error2);
    }
    next();
  },
  loginParamsValidator: function loginParamsValidator(req, res, next) {
    var availableParams = ['usernameOrEmail', 'password'];

    var errorArray = [];

    availableParams.forEach(function (param) {
      if (!Object.keys(req.body).includes(param)) {
        errorArray.push(param + ' is required');
      }
    });

    if (!errorArray.length) {
      return next();
    }

    var errorMessage = JSON.stringify(errorArray);
    var error = new Error(errorMessage);
    error.status = 400;
    return next(error);
  },
  loginNonEmptyParamsValidator: function loginNonEmptyParamsValidator(req, res, next) {
    var availableParams = ['usernameOrEmail', 'password'];
    var errorArray = [];

    availableParams.forEach(function (param) {
      if (!req.body[param].trim().length) {
        errorArray.push(param + ' must not be empty');
      }
    });

    if (!errorArray.length) {
      return next();
    }

    var errorMessage = JSON.stringify(errorArray);
    var error = new Error(errorMessage);
    error.status = 400;
    return next(error);
  },
  invalidCredentials: function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res, next) {
      var _req$body, usernameOrEmail, password, loginUser, error, validPassword, _error3;

      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _req$body = req.body, usernameOrEmail = _req$body.usernameOrEmail, password = _req$body.password;
              _context3.next = 3;
              return User.findOne({
                where: (0, _defineProperty3.default)({}, or, [{ username: (0, _defineProperty3.default)({}, iLike, usernameOrEmail) }, { email: (0, _defineProperty3.default)({}, iLike, usernameOrEmail) }])
              });

            case 3:
              loginUser = _context3.sent;

              if (loginUser) {
                _context3.next = 8;
                break;
              }

              error = new Error('Invalid Credentials');

              error.status = 400;
              return _context3.abrupt('return', next(error));

            case 8:
              _context3.next = 10;
              return loginUser.validPassword(password);

            case 10:
              validPassword = _context3.sent;

              if (validPassword) {
                _context3.next = 15;
                break;
              }

              _error3 = new Error('Invalid Password');

              _error3.status = 400;
              return _context3.abrupt('return', next(_error3));

            case 15:
              next();

            case 16:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function invalidCredentials(_x7, _x8, _x9) {
      return _ref3.apply(this, arguments);
    }

    return invalidCredentials;
  }()
};