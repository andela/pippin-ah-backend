export default (typeChecker = '', inputArray = '', next) => {
  inputArray.forEach((input) => {
    if (!typeChecker(input)) {
      const error = new Error('Invalid input type for this param!');
      error.status = 400;
      return next(error);
    }
  });
};
