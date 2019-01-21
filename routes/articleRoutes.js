import express from 'express';
import Articles from '../controllers/article';
import {
  verifyToken,
  articleValidation,
  profileValidations
} from '../middlewares';

const router = express.Router();

const { createArticle } = Articles;
const { categoryValidator } = profileValidations;
const {
  expectedParamsValidator,
  nonEmptyParamsValidator
} = articleValidation;

router.route('/articles')
  .all(verifyToken)
  .post(
    expectedParamsValidator,
    nonEmptyParamsValidator,
    categoryValidator,
    createArticle);

export default router;
