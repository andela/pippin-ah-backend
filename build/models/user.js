'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true

    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false

    },
    isMentor: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    hooks: {
      beforeCreate: function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(user) {
          return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return user.hashPassword();

                case 2:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, undefined);
        }));

        function beforeCreate(_x) {
          return _ref.apply(this, arguments);
        }

        return beforeCreate;
      }()
    }
  });

  User.associate = function (models) {
    User.hasOne(models.Profile, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    User.hasMany(models.Report, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  User.prototype.hashPassword = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      var saltRounds;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              saltRounds = 10;
              _context2.next = 3;
              return _bcrypt2.default.hash(this.password, saltRounds);

            case 3:
              this.password = _context2.sent;
              return _context2.abrupt('return', this.password);

            case 5:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function hashPassword() {
      return _ref2.apply(this, arguments);
    }

    return hashPassword;
  }();

  User.prototype.validPassword = function validPassword(password) {
    return _bcrypt2.default.compare(password, this.password);
  };

  return User;
};