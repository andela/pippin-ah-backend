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

var getUser = _user2.default.getUser,
    updateUser = _user2.default.updateUser;


var router = _express2.default.Router();

router.route('/user').all(_middlewares.verifyToken).get(getUser).put(updateUser);

exports.default = router;