import express from 'express';
import Articles from '../controllers/article';

const router = express.Router();
const { createArticle } = Articles;

router.route('/articles')
  .post(createArticle);

export default router;
