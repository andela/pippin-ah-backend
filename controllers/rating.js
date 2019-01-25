import models from '../models';

const { Article } = models;

export default {
  async rateArticle(req, res) {
    const {
      params: { slug },
      body: { rateValue },
      decoded: { id }
    } = req;
    const article = await Article.findOne({ where: { slug } });
    const { rating } = article;

    if (!rating) {
      await article.update({
        rating: { [id]: rateValue }
      });
      await article.update({
        aveRating: rateValue
      });
    }

    if (rating) {
      rating[id] = rateValue;
      await article.update({
        rating
      });

      const ratingArray = Object.values(rating);
      const sum = ratingArray.reduce((a, b) => Number(a) + Number(b));
      const aveRating = Math.round((sum / ratingArray.length) * 10) / 10;

      await article.update({
        aveRating
      });
    }
    return res.json({
      title: article.title,
      slug: article.slug,
      yourRating: rateValue,
      averageRating: article.aveRating
    });
  }

};
