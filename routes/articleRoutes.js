import express from 'express';
import { Article } from '../controllers';
import {
  verifyToken,
  articleValidation,
  profileValidations
} from '../middlewares';

const router = express.Router();

const { createArticle, getArticle } = Article;
const { interestsValidator } = profileValidations;
const {
  expectedParamsValidator,
  nonEmptyParamsValidator,
  existingTitleValidator
} = articleValidation;

router.route('/articles')
  .post(
    verifyToken,
    expectedParamsValidator,
    nonEmptyParamsValidator,
    existingTitleValidator,
    interestsValidator,
    createArticle
  );

router.route('/articles/:slug')
  .get(getArticle);

export default router;
