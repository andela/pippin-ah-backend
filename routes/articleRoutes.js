import express from 'express';
import { Article } from '../controllers';
import {
  verifyToken,
  articleValidation
} from '../middlewares';

const router = express.Router();

const { createArticle } = Article;
const {
  expectedParamsValidator,
  nonEmptyParamsValidator,
  existingTitleValidator,
  categoryValidator
} = articleValidation;

router.route('/articles')
  .all(verifyToken)
  .post(
    expectedParamsValidator,
    nonEmptyParamsValidator,
    existingTitleValidator,
    categoryValidator,
    createArticle
  );

export default router;
