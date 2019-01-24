import express from 'express';
import {
  Article,
  Comment,
  Reaction,
  Rating
} from '../controllers';

import {
  verifyToken,
  articleValidation,
  commentValidations,
  ratingValidation
} from '../middlewares';

const router = express.Router();

const {
  createArticle,
  getArticle,
  tagArticle,
  reportArticle,
  getArticleByCategory
} = Article;

const { addComment } = Comment;
const { like, cancelReaction, dislike } = Reaction;
const {
  expectedParamsValidator,
  nonEmptyParamsValidator,
  existingTitleValidator,
  checkIfTagIsString,
  categoryValidator,
  checkIfUserAlreadyReported,
  reportIsEmpty,
  reportIsRequired,
  categoryQueryValidator
} = articleValidation;
const {
  ensureCommentInput,
  ensureValidComment,
  ensureArticleExists
} = commentValidations;

const { verifyMentor } = ratingValidation;

router.route('/')
  .post(
    verifyToken,
    expectedParamsValidator,
    nonEmptyParamsValidator,
    existingTitleValidator,
    categoryValidator,
    createArticle
  );

router.route('/report/:slug')
  .post(
    verifyToken,
    ensureArticleExists,
    reportIsRequired,
    reportIsEmpty,
    checkIfUserAlreadyReported,
    reportArticle
  );

router.route('/tag')
  .patch(
    verifyToken,
    checkIfTagIsString,
    tagArticle
  );

router.route('/categories')
  .get(categoryQueryValidator, getArticleByCategory);

router.route('/:slug')
  .get(
    ensureArticleExists,
    getArticle
  );

router.route('/rating/:slug')
  .patch(
    verifyToken,
    Rating.rateArticle
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
