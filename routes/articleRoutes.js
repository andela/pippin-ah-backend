import express from 'express';
import { Article, Comment } from '../controllers';
import {
  verifyToken,
  articleValidation,
  commentValidations
} from '../middlewares';

const router = express.Router();

const { createArticle, getArticle } = Article;
const { addComment } = Comment;
const {
  expectedParamsValidator,
  nonEmptyParamsValidator,
  existingTitleValidator,
  categoryValidator
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
    categoryValidator,
    createArticle
  );

router.route('/:slug')
  .get(
    ensureArticleExists,
    getArticle
  );

router.route('/:slug/comments')
  .post(
    verifyToken,
    ensureArticleExists,
    ensureCommentInput,
    ensureValidComment,
    addComment
  );

export default router;
