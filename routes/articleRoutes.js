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
  getArticleBySlug,
  getArticles,
  reportArticle,
  tagArticle,
  bookmarkArticle,
  getBookmarkedArticle,
  removeBookmarkedArticle
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
  categoryQueryValidator,
  checkIfSlugExist
} = articleValidation;

const {
  isCommentSupplied,
  isNewCommentSupplied,
  isCommentValid,
  isNewCommentValid,
  doesArticleExist,
  doesCommentExist,
  validateUser
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
    doesArticleExist,
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
  .get(categoryQueryValidator, getArticles);

router.route('/bookmarks')
  .get(verifyToken, getBookmarkedArticle);


router.route('/bookmarks/:slug')
  .all(verifyToken)
  .post(checkIfSlugExist, bookmarkArticle)
  .patch(checkIfSlugExist, removeBookmarkedArticle);


router.route('/:slug')
  .get(
    doesArticleExist,
    getArticleBySlug
  );

router.route('/rating/:slug')
  .patch(
    verifyToken,
    userIsMentor,
    doesArticleExist,
    isRateValueSupplied,
    inputTypeIsValid,
    ratingIsInRange,
    rateArticle
  );

router.route('/:slug/comments')
  .post(
    verifyToken,
    doesArticleExist,
    isCommentSupplied,
    isCommentValid,
    addComment
  );

router.route('/:slug/comments/:id')
  .patch(
    verifyToken,
    doesArticleExist,
    doesCommentExist,
    validateUser,
    isNewCommentSupplied,
    isNewCommentValid,
    editComment
  )
  .get(doesCommentExist, getComment);

router.route('/:slug/comments/:id/edits')
  .get(
    doesCommentExist,
    getCommentEditHistory
  );

router.route('/:slug/comments/:id')
  .delete(
    verifyToken,
    doesCommentExist,
    validateUser,
    deleteComment
  );

router.route('/:slug/like')
  .patch(verifyToken, doesArticleExist, like);

router.route('/:slug/cancelreaction')
  .patch(verifyToken, doesArticleExist, cancelReaction);

router.route('/:slug/dislike')
  .patch(verifyToken, doesArticleExist, dislike);

export default router;
