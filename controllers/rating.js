import models from '../models';

const { Article } = models;

export default {
  async rateArticle(req, res) {
    const { params: { slug }, decoded: { id } } = req;
    let { rateValue } = req.body;
    rateValue = Number(rateValue);

    const article = await Article.findOne({ where: { slug } });
    const { rating } = article;

    if (!rating) {
      await article.update({
        rating: { [id]: rateValue },
        aveRating: rateValue
      });
    }

    if (rating) {
      rating[id] = rateValue;
      const ratingArray = Object.values(rating);
      const sum = ratingArray.reduce((a, b) => a + b);
      const aveRating = Math.round((sum / ratingArray.length) * 10) / 10;

      await article.update({
        rating,
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
