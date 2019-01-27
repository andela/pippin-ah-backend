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
  tagArticle,
  reportArticle,
  getArticleBySlug,
  getArticles,
} = Article;

const {
  addComment,
  editComment,
  getComment,
  getCommentEditHistory,
  deleteComment
} = Comment;
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
  isCommentSupplied,
  isNewCommentSupplied,
  isCommentValid,
  isNewCommentValid,
  ensureArticleExists
} = commentValidations;

const {
  userIsMentor,
  isRateValueSupplied,
  inputTypeIsValid,
  ratingIsInRange
} = ratingValidation;

const { rateArticle } = Rating;

router.route('/')
  .get(categoryQueryValidator, getArticles)
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

router.route('/:slug')
  .get(
    ensureArticleExists,
    getArticleBySlug
  );

router.route('/rating/:slug')
  .patch(
    verifyToken,
    userIsMentor,
    ensureArticleExists,
    isRateValueSupplied,
    inputTypeIsValid,
    ratingIsInRange,
    rateArticle
  );

router.route('/:slug/comments')
  .post(
    verifyToken,
    ensureArticleExists,
    isCommentSupplied,
    isCommentValid,
    addComment
  );

router.route('/:slug/comments/:id')
  .patch(
    verifyToken,
    ensureArticleExists,
    isNewCommentSupplied,
    isNewCommentValid,
    editComment
  )
  .get(getComment);

router.route('/:slug/comments/:id/edits')
  .get(getCommentEditHistory);

router.route('/:slug/comments/:id')
  .delete(
    verifyToken,
    deleteComment
  );

router.route('/:slug/like')
  .patch(verifyToken, ensureArticleExists, like);

router.route('/:slug/cancelreaction')
  .patch(verifyToken, ensureArticleExists, cancelReaction);

router.route('/:slug/dislike')
  .patch(verifyToken, ensureArticleExists, dislike);

export default router;
