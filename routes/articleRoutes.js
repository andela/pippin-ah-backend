import express from 'express';
import { Article, Comment } from '../controllers';
import {
  verifyToken,
  articleValidation,
  profileValidations,
  commentValidations
} from '../middlewares';

const router = express.Router();

const { createArticle } = Article;
const { addComment } = Comment;
const { interestsValidator } = profileValidations;
const {
  expectedParamsValidator,
  nonEmptyParamsValidator,
  existingTitleValidator
} = articleValidation;
const {
  ensureCommentInput,
  ensureValidComment,
  ensureArticleExists
} = commentValidations;

router.route('/articles')
  .all(verifyToken)
  .post(
    expectedParamsValidator,
    nonEmptyParamsValidator,
    existingTitleValidator,
    interestsValidator,
    createArticle
  );

router.route('/articles/:slug/comments')
  .post(
    verifyToken,
    ensureCommentInput,
    ensureValidComment,
    ensureArticleExists,
    addComment
  );

export default router;
