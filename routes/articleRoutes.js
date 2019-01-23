import express from 'express';
import { Article } from '../controllers';
import {
  verifyToken,
  articleValidation,
  profileValidations
} from '../middlewares';

const router = express.Router();

const { createArticle, tagArticle } = Article;
const { interestsValidator } = profileValidations;
const {
  expectedParamsValidator,
  nonEmptyParamsValidator,
  existingTitleValidator
} = articleValidation;

router.route('/articles')
  .all(verifyToken)
  .post(
    expectedParamsValidator,
    nonEmptyParamsValidator,
    existingTitleValidator,
    interestsValidator,
    createArticle
  );

router.route('/articles/tag')
  .post(verifyToken, tagArticle);

export default router;
