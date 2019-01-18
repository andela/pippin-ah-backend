const onEmptyParamsValidator = (req, res, nonEmptyParams, next) => {
  const errorArray = [];

  nonEmptyParams.forEach((param) => {
    if (!req.body[param].trim().length) {
      errorArray.push(`${param} must not be empty`);
    }
  });

  if (!errorArray.length) {
    return next();
  }

  const errorMessage = JSON.stringify(errorArray);
  const error = new Error(errorMessage);
  error.status = 400;
  return next(error);
};

export default onEmptyParamsValidator;
