'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

require('babel-polyfill');

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var _Sequelize$Op = _sequelize2.default.Op,
    iLike = _Sequelize$Op.iLike,
    or = _Sequelize$Op.or;
var User = _models2.default.User;

var secret = process.env.SECRET_KEY;
var time = { expiresIn: '72hrs' };
var generateToken = function generateToken(payload) {
  return _jsonwebtoken2.default.sign(payload, secret, time);
};

/**
 * @class
 */

var Users = function () {
  function Users() {
    (0, _classCallCheck3.default)(this, Users);
  }

  (0, _createClass3.default)(Users, null, [{
    key: 'getUser',

    /**
        * Represents getUser controller
        * @constructor
        * @param {object} req - The request object.
        * @param {object} res - The response object.
        * @param {object} next -The next middleware
        */
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var id, user;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                id = req.decoded.id;
                _context.next = 3;
                return User.findOne({ where: { id: id } });

              case 3:
                user = _context.sent;
                return _context.abrupt('return', res.json({
                  username: user.username,
                  email: user.email,
                  isMentor: user.isMentor
                }));

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getUser(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return getUser;
    }()

    /**
      * Controll update a user.
      * @constructor
      * @param {object} req - The request object.
      * @param {object} res - The response object.
      */

  }, {
    key: 'updateUser',
    value: function updateUser(req, res) {
      User.findByPk(req.params.userId).then(function (user) {
        if (!user) {
          return res.status(404).json({
            message: 'User Not Found'
          });
        }

        return user.update({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password
        }).then(function (updatedUser) {
          return res.status(200).json({
            updatedUser: updatedUser,
            message: 'User Has been updated'
          });
        }).catch(function (error) {
          return res.status(400).send(error);
        });
      });
    }

    /**
      * Represents a controller.
      * @constructor
      * @param {object} req - The request object.
      * @param {object} res - The response object.
      * @param {object} next - The response object.
      */

  }, {
    key: 'login',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var _req$body, usernameOrEmail, password, user, tokenPayload;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _req$body = req.body, usernameOrEmail = _req$body.usernameOrEmail, password = _req$body.password;
                _context2.next = 3;
                return User.findOne({
                  where: (0, _defineProperty3.default)({}, or, [{ username: (0, _defineProperty3.default)({}, iLike, usernameOrEmail) }, { email: (0, _defineProperty3.default)({}, iLike, usernameOrEmail) }])
                });

              case 3:
                user = _context2.sent;
                _context2.next = 6;
                return user.validPassword(password);

              case 6:
                tokenPayload = {
                  id: user.id,
                  isMentor: user.isMentor
                };
                return _context2.abrupt('return', res.status(200).json({
                  message: 'Login was successful',
                  token: generateToken(tokenPayload)
                }));

              case 8:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function login(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return login;
    }()

    /**
      * Represents a controller.
      * @constructor
      * @param {object} req - The request object.
      * @param {object} res - The response object.
      */

  }, {
    key: 'register',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        var _req$body2, username, email, password, user, tokenPayload, token;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _req$body2 = req.body, username = _req$body2.username, email = _req$body2.email, password = _req$body2.password;
                _context3.next = 3;
                return User.create({
                  username: username,
                  email: email,
                  password: password
                });

              case 3:
                user = _context3.sent;
                tokenPayload = {
                  id: user.id,
                  isMentor: user.isMentor
                };
                token = generateToken(tokenPayload);

                console.log(tokenPayload);

                return _context3.abrupt('return', res.status(201).json({
                  username: user.username,
                  email: user.email,
                  token: token
                }));

              case 8:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function register(_x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return register;
    }()
  }]);
  return Users;
}();

exports.default = Users;
//# sourceMappingURL=user.js.map