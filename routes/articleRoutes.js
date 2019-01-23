import express from 'express';
import { Article, Comment } from '../controllers';
import {
  verifyToken,
  articleValidation,
  profileValidations,
  commentValidations
} from '../middlewares';

const router = express.Router();

const { createArticle, getArticle } = Article;
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

router.route('/')
  .post(
    verifyToken,
    expectedParamsValidator,
    nonEmptyParamsValidator,
    existingTitleValidator,
    interestsValidator,
    createArticle
  );

router.route('/:slug')
  .get(getArticle);

router.route('/:slug/comments')
  .post(
    verifyToken,
    ensureArticleExists,
    ensureCommentInput,
    ensureValidComment,
    addComment
  );

export default router;
