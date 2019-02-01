import { isString, isNumber } from 'util';
import inputTypeValidator from './inputTypeValidator';

export default {
  isInputSupplied(req, res, next) {
    const {
      highlightedText,
      startIndex,
      stopIndex,
      comment
    } = req.body;

    const inputArray = [highlightedText, startIndex, stopIndex, comment];
    const errorArray = [];

    inputArray.forEach((input) => {
      if (!input) errorArray.push(`${input} is required`);
    });

    if (!errorArray.length) return next();
    const errorMessage = JSON.stringify(errorArray);
    const error = new Error(errorMessage);
    error.status = 400;
    return next(error);
  },

  isInputTypeValid(req, res, next) {
    const {
      highlightedText,
      startIndex,
      stopIndex,
      comment
    } = req.body;
    const stringInputArray = [highlightedText, comment];
    const numericInputArray = [startIndex, stopIndex];
    inputTypeValidator(isString, stringInputArray, next);
    inputTypeValidator(isNumber, numericInputArray, next);
    return next();
  }
};
