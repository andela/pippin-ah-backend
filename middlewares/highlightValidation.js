import { isString } from 'util';
import { isNumeric } from 'validator';
import inputTypeValidator from './inputTypeValidator';

export default {
  isHighlightInputSupplied(req, res, next) {
    const {
      highlightedText,
      startIndex,
      stopIndex,
      comment
    } = req.body;

    const inputArray = [highlightedText, startIndex, stopIndex, comment];

    inputArray.forEach((input) => {
      if (!input) {
        const error = new Error('Required params are not supplied');
        error.status = 400;
        return next(error);
      }
    });
    return next();
  },

  isHighlightInputTypeValid(req, res, next) {
    const {
      highlightedText,
      startIndex,
      stopIndex,
      comment
    } = req.body;
    const stringInputArray = [highlightedText, comment];
    const numericInputArray = [startIndex, stopIndex];
    const strErrorMsg = '[highlightedText] and [comment] have to be strings!';
    const numErrorMsg = '[startIndex] and [stopIndex] have to be numeric!';
    inputTypeValidator(isString, stringInputArray, strErrorMsg, next);
    inputTypeValidator(isNumeric, numericInputArray, numErrorMsg, next);
    return next();
  }
};
