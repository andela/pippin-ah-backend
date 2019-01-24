import express from 'express';
import { Article, Comment, Reaction } from '../controllers';
import {
  verifyToken,
  articleValidation,
  commentValidations
} from '../middlewares';

const router = express.Router();

const {
  createArticle,
  getArticle,
  tagArticle,
  reportArticle
} = Article;

const { addComment } = Comment;
const { like, cancelReaction, dislike } = Reaction;
const {
  expectedParamsValidator,
  nonEmptyParamsValidator,
  existingTitleValidator,
  checkIfTagIsString,
  categoryValidator,
  checkIfArticleIdExists,
  checkIfUserAlreadyReported,
  reportValidator
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

router.route('/report')
  .post(
    verifyToken,
    reportValidator,
    checkIfArticleIdExists,
    checkIfUserAlreadyReported,
    reportArticle
  );

router.route('/tag')
  .patch(
    verifyToken,
    checkIfTagIsString,
    tagArticle
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

router.route('/:slug/cancelreaction')
  .patch(verifyToken, ensureArticleExists, cancelReaction);

router.route('/:slug/dislike')
  .patch(verifyToken, ensureArticleExists, dislike);

export default router;
