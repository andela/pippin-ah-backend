import Sequelize from 'sequelize';
import models from '../models';


export default {
  isInputSupplied(req, res, next) {
    const {
      highlightedText, startIndex, stopIndex, comment
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
  }
};
