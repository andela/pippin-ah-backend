"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// eslint-disable-next-line no-unused-vars
exports.default = function (err, req, res, next) {
  res.status(err.status).send({
    error: err.message
  });
};
//# sourceMappingURL=errorHandler.js.map