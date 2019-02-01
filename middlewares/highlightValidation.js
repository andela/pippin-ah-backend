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

    // eslint-disable-next-line
    const requiredParams = ['highlightedText', 'startIndex', 'stopIndex', 'comment'];
    const inputArray = [highlightedText, startIndex, stopIndex, comment];

    inputArray.forEach((input) => {
      if (!input) {
        // eslint-disable-next-line
        const errorMessage = `A required param is not supplied. required params are [${requiredParams}]`;
        const error = new Error(errorMessage);
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
    const numErrorMsg = '[startIndex] and [stopIndex] have to be strings!';
    inputTypeValidator(isString, stringInputArray, strErrorMsg, next);
    inputTypeValidator(isNumeric, numericInputArray, numErrorMsg, next);
    return next();
  }
};
