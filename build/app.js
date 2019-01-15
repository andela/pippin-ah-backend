'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('babel-polyfill');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _routes = require('./routes');

var _middlewares = require('./middlewares');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

// Create global app object
var app = (0, _express2.default)();

app.use((0, _cors2.default)());

// Normal express config defaults
app.use(require('morgan')('dev'));

app.use(_express2.default.urlencoded({ extended: false }));
app.use(_express2.default.json());

app.use('/api/v1/users', _routes.authRoutes);
app.use('/api/v1', _routes.userRoutes);
app.use(_middlewares.notFoundRoute);
app.use(_middlewares.errorHandler);

exports.default = app;