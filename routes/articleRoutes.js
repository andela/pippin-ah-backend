import express from 'express';
import { Article, Comment } from '../controllers';
import {
  verifyToken,
  articleValidation,
  profileValidations,
  commentValidations
} from '../middlewares';

const router = express.Router();

<<<<<<< HEAD
const { createArticle, getArticle } = Article;
=======
const { createArticle } = Article;
const { addComment } = Comment;
>>>>>>> bdf3e9182099a63363e900373a3e1d8ed3b8c9ae
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

router.route('/articles/:slug')
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
