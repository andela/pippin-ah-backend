export default (typeChecker, inputArray, errorMessage, next) => {
  inputArray.forEach((input) => {
    if (!typeChecker(input)) {
      const error = new Error(errorMessage);
      error.status = 400;
      return next(error);
    }
  });
};
