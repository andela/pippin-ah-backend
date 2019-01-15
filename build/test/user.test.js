'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

describe('USER TEST SUITE', function () {
  var firstUserToken = void 0;
  before((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var requestObject, responseObject;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models2.default.sequelize.sync({ force: true });

          case 2:
            requestObject = {
              username: 'johnsolomon',
              email: 'john@solomon.com',
              password: 'johnny777'
            };
            _context.next = 5;
            return _chai2.default.request(_app2.default).post('/api/v1/users').send(requestObject);

          case 5:
            responseObject = _context.sent;

            firstUserToken = responseObject.body.token;

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  describe('User Signup Validations', function () {
    it('should fail creation if password contains special characters', function (done) {
      var newUser2 = {
        username: 'habibaudu',
        email: 'auduhabib1990@gmail.com',
        password: 'hhrt----'
      };
      _chai2.default.request(_app2.default).post('/api/v1/users').send(newUser2).end(function (err, res) {
        (0, _chai.expect)(res.status).to.equal(400);
        (0, _chai.expect)(res.body.error).to.equal('password must contain only numbers and alphabet');
        done();
      });
    });

    it('should successfully create user when valid params are supplied', function (done) {
      var newUser2 = {
        username: 'habibaudu',
        email: 'auduhabib1990@gmail.com',
        password: 'hhrtuyhgt678'
      };
      _chai2.default.request(_app2.default).post('/api/v1/users').send(newUser2).end(function (err, res) {
        (0, _chai.expect)(res.status).to.equal(201);
        done();
      });
    });

    it('should fail creation when email is already in use', function (done) {
      var newUser2 = {
        username: 'habibaudu',
        email: 'auduhabib1990@gmail.com',
        password: 'hhrtuyhgt678'
      };
      _chai2.default.request(_app2.default).post('/api/v1/users').send(newUser2).end(function (err, res) {
        (0, _chai.expect)(res.status).to.equal(409);
        (0, _chai.expect)(res.body.error).to.equal('Email already in use');
        done();
      });
    });

    it('should fail creation when case is changed for used email', function (done) {
      var newUser2 = {
        username: 'habibaudu',
        email: 'Auduhabib1990@gmail.com',
        password: 'hhrtuyhgt678'
      };
      _chai2.default.request(_app2.default).post('/api/v1/users').send(newUser2).end(function (err, res) {
        (0, _chai.expect)(res.status).to.equal(409);
        (0, _chai.expect)(res.body.error).to.equal('Email already in use');
        done();
      });
    });

    it('should fail creation when username is already in use', function (done) {
      var newUser2 = {
        username: 'habibaudu',
        email: 'auduhabib@gmail.com',
        password: 'hhrtuyhgt678'
      };
      _chai2.default.request(_app2.default).post('/api/v1/users').send(newUser2).end(function (err, res) {
        (0, _chai.expect)(res.status).to.equal(409);
        (0, _chai.expect)(res.body.error).to.equal('Username already in use');
        done();
      });
    });

    it('should fail creation when case is changed for used username', function (done) {
      var newUser2 = {
        username: 'Habibaudu',
        email: 'auduhabib@gmail.com',
        password: 'hhrtuyhgt678'
      };
      _chai2.default.request(_app2.default).post('/api/v1/users').send(newUser2).end(function (err, res) {
        (0, _chai.expect)(res.status).to.equal(409);
        (0, _chai.expect)(res.body.error).to.equal('Username already in use');
        done();
      });
    });

    it('should not allow user creation when password is less than 8 characters', function (done) {
      var newUser2 = {
        username: 'habibaudu',
        email: 'auduhabib1990@gmail.com',
        password: 'hba123'
      };
      _chai2.default.request(_app2.default).post('/api/v1/users').send(newUser2).end(function (err, res) {
        (0, _chai.expect)(res.status).to.equal(400);
        (0, _chai.expect)(res.body.error).to.equal('Your password must be at least 8 characters');
        done();
      });
    });

    it('should not allow user creation whenn username is not up to 6 chars', function (done) {
      var newUser2 = {
        username: 'habib',
        email: 'auduhabib1990@gmail.com',
        password: 'hbasdg3546'
      };
      _chai2.default.request(_app2.default).post('/api/v1/users').send(newUser2).end(function (err, res) {
        (0, _chai.expect)(res.status).to.equal(400);
        (0, _chai.expect)(res.body.error).to.equal('Your username must be at least 6 characters');
        done();
      });
    });

    it('should only allow alphanumeric usernames', function (done) {
      var newUser2 = {
        username: '------------',
        email: 'auduhabib1990@gmail.com',
        password: 'hbasdg3546'
      };
      _chai2.default.request(_app2.default).post('/api/v1/users').send(newUser2).end(function (err, res) {
        (0, _chai.expect)(res.status).to.equal(400);
        (0, _chai.expect)(res.body.error).to.equal('username must contain only alphabets and numbers');
        done();
      });
    });

    it('should only allow valid emails', function (done) {
      var newUser2 = {
        username: 'hbabsgdhh',
        email: 'auduhabib19gmail.com',
        password: 'hbasdg3546'
      };
      _chai2.default.request(_app2.default).post('/api/v1/users').send(newUser2).end(function (err, res) {
        (0, _chai.expect)(res.status).to.equal(400);
        (0, _chai.expect)(res.body.error).to.equal('please Enter a valid Email');
        done();
      });
    });

    it('should not allow creation when fields are empty', function (done) {
      var newUser2 = {
        username: '',
        email: '',
        password: ''
      };
      _chai2.default.request(_app2.default).post('/api/v1/users').send(newUser2).end(function (err, res) {
        var errorResult = JSON.parse(res.body.error);
        (0, _chai.expect)(res.status).to.equal(400);
        (0, _chai.expect)(errorResult.length).to.equal(3);
        // eslint-disable-next-line no-unused-expressions
        (0, _chai.expect)(Array.isArray(errorResult)).to.be.true;
        (0, _chai.expect)(errorResult[0]).to.equal('username must not be empty');
        done();
      });
    });

    it('should not allow creation when required params are not provided', function (done) {
      var newUser2 = {
        username: 'abatamaya'
      };
      _chai2.default.request(_app2.default).post('/api/v1/users').send(newUser2).end(function (err, res) {
        var errorResult = JSON.parse(res.body.error);
        (0, _chai.expect)(res.status).to.equal(400);
        (0, _chai.expect)(errorResult.length).to.equal(2);
        // eslint-disable-next-line no-unused-expressions
        (0, _chai.expect)(Array.isArray(errorResult)).to.be.true;
        (0, _chai.expect)(errorResult[0]).to.equal('email is required');
        (0, _chai.expect)(errorResult[1]).to.equal('password is required');
        done();
      });
    });
  });

  describe('User SignIn Validations', function () {
    it('should sign user in with valid email and password', function (done) {
      var newUser2 = {
        usernameOrEmail: 'auduhabib1990@gmail.com',
        password: 'hhrtuyhgt678'
      };
      _chai2.default.request(_app2.default).post('/api/v1/users/login').send(newUser2).end(function (err, res) {
        (0, _chai.expect)(res.status).to.equal(200);
        (0, _chai.expect)(res.body.message).to.equal('Login was successful');
        done();
      });
    });

    it('should sign user in with valid username and password', function (done) {
      var newUser2 = {
        usernameOrEmail: 'habibaudu',
        password: 'hhrtuyhgt678'
      };
      _chai2.default.request(_app2.default).post('/api/v1/users/login').send(newUser2).end(function (err, res) {
        (0, _chai.expect)(res.status).to.equal(200);
        (0, _chai.expect)(res.body.message).to.equal('Login was successful');
        done();
      });
    });

    it('should not allow  invalid email or password signIn', function (done) {
      var newUser2 = {
        usernameOrEmail: 'auduhabib0@gmail.com',
        password: 'invalidpassword'
      };
      _chai2.default.request(_app2.default).post('/api/v1/users/login').send(newUser2).end(function (err, res) {
        (0, _chai.expect)(res.status).to.equal(400);
        (0, _chai.expect)(res.body.error).to.equal('Invalid Credentials');
        done();
      });
    });

    it('should not allow invalid password signIn', function (done) {
      var newUser2 = {
        usernameOrEmail: 'auduhabib1990@gmail.com',
        password: 'invalidpassword'
      };
      _chai2.default.request(_app2.default).post('/api/v1/users/login').send(newUser2).end(function (err, res) {
        (0, _chai.expect)(res.status).to.equal(400);
        (0, _chai.expect)(res.body.error).to.equal('Invalid Password');
        done();
      });
    });

    it('should not login user when required params are not provided', function (done) {
      var newUser2 = {};
      _chai2.default.request(_app2.default).post('/api/v1/users/login').send(newUser2).end(function (err, res) {
        var errorResult = JSON.parse(res.body.error);
        (0, _chai.expect)(res.status).to.equal(400);
        // eslint-disable-next-line no-unused-expressions
        (0, _chai.expect)(Array.isArray(errorResult)).to.be.true;
        (0, _chai.expect)(errorResult[0]).to.equal('usernameOrEmail is required');
        (0, _chai.expect)(errorResult[1]).to.equal('password is required');
        done();
      });
    });

    it('should not allow login when fields are empty', function (done) {
      var newUser2 = {
        UsernameOrEmail: '  ',
        password: '   '
      };
      _chai2.default.request(_app2.default).post('/api/v1/users/login').send(newUser2).end(function (err, res) {
        var errorResult = JSON.parse(res.body.error);
        (0, _chai.expect)(res.status).to.equal(400);
        // eslint-disable-next-line no-unused-expressions
        (0, _chai.expect)(Array.isArray(errorResult)).to.be.true;
        (0, _chai.expect)(errorResult[0]).to.equal('usernameOrEmail is required');
        done();
      });
    });

    it('should not allow login when username is empty', function (done) {
      var newUser2 = {
        username: '    ',
        password: 'hhrtuyhgt678'
      };
      _chai2.default.request(_app2.default).post('/api/v1/users/login').send(newUser2).end(function (err, res) {
        var errorResult = JSON.parse(res.body.error);
        (0, _chai.expect)(res.status).to.equal(400);
        // eslint-disable-next-line no-unused-expressions
        (0, _chai.expect)(Array.isArray(errorResult)).to.be.true;
        (0, _chai.expect)(errorResult[0]).to.equal('usernameOrEmail is required');
        done();
      });
    });

    it('should not allow creation when fields are empty', function (done) {
      var newUser2 = {
        usernameOrEmail: '',
        password: ''
      };
      _chai2.default.request(_app2.default).post('/api/v1/users/login').send(newUser2).end(function (err, res) {
        var errorResult = JSON.parse(res.body.error);
        (0, _chai.expect)(res.status).to.equal(400);
        (0, _chai.expect)(errorResult.length).to.equal(2);
        // eslint-disable-next-line no-unused-expressions
        (0, _chai.expect)(Array.isArray(errorResult)).to.be.true;
        (0, _chai.expect)(errorResult[0]).to.equal('usernameOrEmail must not be empty');
        (0, _chai.expect)(errorResult[1]).to.equal('password must not be empty');
        done();
      });
    });
  });

  describe('Get a single User', function () {
    it('Should get a user with valid user id present in database', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      var response;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _chai2.default.request(_app2.default).get('/api/v1/user').set('Authorization', firstUserToken);

            case 2:
              response = _context2.sent;

              (0, _chai.expect)(response.body.username).to.equal('johnsolomon');

            case 4:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    })));

    it('Should not get a user when the token is not provided', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
      var response;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _chai2.default.request(_app2.default).get('/api/v1/user');

            case 2:
              response = _context3.sent;

              (0, _chai.expect)(response.body.error).to.equal('No token provided');

            case 4:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    })));

    it('Should not get a user when invalid token is provided', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
      var response;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return _chai2.default.request(_app2.default).get('/api/v1/user').set('Authorization', 'fjjdfjdjfdjfjf');

            case 2:
              response = _context4.sent;

              (0, _chai.expect)(response.body.error).to.equal('Invalid token');

            case 4:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    })));
  });
});