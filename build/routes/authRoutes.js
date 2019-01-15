'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _user = require('../controllers/user');

var _user2 = _interopRequireDefault(_user);

var _middlewares = require('../middlewares');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expectedParamsValidator = _middlewares.userValidations.expectedParamsValidator,
    nonEmptyParamsValidator = _middlewares.userValidations.nonEmptyParamsValidator,
    emailExistsValidator = _middlewares.userValidations.emailExistsValidator,
    usernameExistsValidator = _middlewares.userValidations.usernameExistsValidator,
    emailIsValid = _middlewares.userValidations.emailIsValid,
    usernameValidator = _middlewares.userValidations.usernameValidator,
    passwordValidator = _middlewares.userValidations.passwordValidator,
    loginParamsValidator = _middlewares.userValidations.loginParamsValidator,
    loginNonEmptyParamsValidator = _middlewares.userValidations.loginNonEmptyParamsValidator,
    invalidCredentials = _middlewares.userValidations.invalidCredentials;
var login = _user2.default.login,
    register = _user2.default.register;


var router = _express2.default.Router();

router.route('/').post(expectedParamsValidator, nonEmptyParamsValidator, emailIsValid, usernameValidator, passwordValidator, emailExistsValidator, usernameExistsValidator, register);

router.route('/login').post(loginParamsValidator, loginNonEmptyParamsValidator, invalidCredentials, login);

exports.default = router;