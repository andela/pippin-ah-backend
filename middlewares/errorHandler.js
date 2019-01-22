// eslint-disable-next-line no-unused-vars
export default (err, req, res, next) => {
  console.log('==twitter error====', err);
  res.status(err.status || 500).send({
    error: err.message
  });
};
