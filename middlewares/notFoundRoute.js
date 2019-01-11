export default (req, res, next) => {
  const error = new Error('Route not Found');
  error.status = 404;
  next(error);
};
