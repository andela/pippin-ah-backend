import express from 'express';
import Articles from '../controllers/article';
import { verifyToken, articleValidation } from '../middlewares';

const router = express.Router();

const { createArticle } = Articles;
const {
  expectedParamsValidator,
  nonEmptyParamsValidator
} = articleValidation;

router.route('/articles')
  .all(verifyToken)
  .post(
    expectedParamsValidator,
    nonEmptyParamsValidator,
    createArticle);

export default router;
