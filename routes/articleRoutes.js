import express from 'express';
import Articles from '../controllers/article';
import { verifyToken } from '../middlewares';

const router = express.Router();
const { createArticle } = Articles;

router.route('/articles')
  .all(verifyToken)
  .post(createArticle);

export default router;
