import models from '../models';

const { Article } = models;

export default {
  async rateArticle(req, res) {
    const { slug } = req.params;
    const { newRating } = req.body;
    const { id } = req.decoded;
    const article = await Article.findOne({ where: { slug } });
    const { rating } = article;

    if (!rating) {
      await article.update({
        rating: { [id]: newRating }
      });
    }
    if (rating) {
      rating[id] = newRating;
      await article.update({
        rating
      });
    }
    res.json(article);
  }

};
