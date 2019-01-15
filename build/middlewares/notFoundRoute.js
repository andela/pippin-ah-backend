'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (req, res, next) {
  var error = new Error('Route not found');
  error.status = 404;
  next(error);
};