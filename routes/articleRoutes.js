import express from 'express';
import {
  Article,
  Comment,
  Reaction,
  Rating,
  CommentReaction,
  Highlight
} from '../controllers';

import {
  verifyToken,
  articleValidation,
  commentValidations,
  ratingValidation,
  highlightValidation
} from '../middlewares';

const router = express.Router();

const {
  createArticle,
  getArticleBySlug,
  getArticles,
  reportArticle,
  tagArticle,
  bookmarkArticle,
  getBookmarkedArticles,
  removeBookmarkedArticle,
  shareArticle
} = Article;

const { like, cancelReaction, dislike } = Reaction;
const { likeComment, dislikeComment } = CommentReaction;

const {
  addComment,
  editComment,
  getComment,
  getCommentEditHistory,
  deleteComment
} = Comment;

const {
  addHighlight,
  getAllHighlights,
  removeHighlight
} = Highlight;

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
  checkIfSlugExists,
  isInputValid
} = articleValidation;

const {
  isCommentSupplied,
  isNewCommentSupplied,
  isCommentValid,
  isNewCommentValid,
  isCommentDuplicate,
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

const {
  isHighlightInputSupplied,
  isHighlightInputTypeValid,
  doesHighlightExist,
  doesUserOwnHighlight
} = highlightValidation;

const { rateArticle } = Rating;

router.route('/')
  .get(categoryQueryValidator, getArticles)
  .post(
    verifyToken,
    expectedParamsValidator,
    isInputValid,
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
  .get(verifyToken, getBookmarkedArticles);

router.route('/bookmarks/:slug')
  .all(verifyToken)
  .post(checkIfSlugExists, bookmarkArticle)
  .patch(checkIfSlugExists, removeBookmarkedArticle);


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
    isCommentDuplicate,
    addComment
  );

router.route('/:slug/comments/:id/like')
  .post(verifyToken, doesCommentExist, likeComment);

router.route('/:slug/comments/:id/dislike')
  .patch(verifyToken, doesCommentExist, dislikeComment);

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

router.route('/:slug/share/:provider')
  .get(doesArticleExist, shareArticle);

router.route('/:slug/highlights')
  .post(
    verifyToken,
    doesArticleExist,
    isHighlightInputSupplied,
    isHighlightInputTypeValid,
    addHighlight
  )
  .get(
    verifyToken,
    getAllHighlights
  );

router.route('/:slug/highlights/:id')
  .delete(verifyToken,
    doesArticleExist,
    doesHighlightExist,
    doesUserOwnHighlight,
    removeHighlight
  );

export default router;
