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
      await article.update({
        aveRating: newRating
      });
    }

    if (rating) {
      rating[id] = newRating;
      await article.update({
        rating
      });

      const ratingArray = Object.values(rating);
      const sum = ratingArray.reduce((a, b) => Number(a) + Number(b));
      const aveRating = sum / ratingArray.length;

      await article.update({
        aveRating
      });
    }
    res.json(article);
  }

};
