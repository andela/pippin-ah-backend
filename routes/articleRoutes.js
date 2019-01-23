import express from 'express';
import { Article, Comment, Reaction } from '../controllers';
import {
  verifyToken,
  articleValidation,
  commentValidations
} from '../middlewares';

const router = express.Router();

const { createArticle, getArticle } = Article;
const { addComment } = Comment;
const { like, cancelReaction, dislike } = Reaction;
const { interestsValidator } = profileValidations;
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

router.route('/:slug/like')
  .patch(verifyToken, ensureArticleExists, like);

router.route('/:slug/cancel-reaction')
  .patch(verifyToken, ensureArticleExists, cancelReaction);

router.route('/:slug/dislike')
  .patch(verifyToken, ensureArticleExists, dislike);

export default router;
