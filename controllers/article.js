import 'babel-polyfill';
import models from '../models';
import { generateSlug } from '../helpers';

const { Article, User, Profile } = models;

export default {
  createArticle: async (req, res, next) => {
    const {
      title, body, description, category,
    } = req.body;

    const userId = req.decoded.id;
    const user = await User.findOne(
      {
        where: { id: userId },
        include: [{ model: Profile }]
      });
    const articleExists = await Article.findOne(
      { where: { title, userId } }
    );

    if (articleExists) {
      const errorMessage = 'User already has an article with this title';
      const error = new Error(errorMessage);
      error.status = 400;
      return next(error);
    }

    const profile = user.Profile;
    const article = await Article
      .create({
        title,
        body,
        description,
        category,
        slug: generateSlug(title),
        userId,
      });
    return res.status(201).json({
      title: article.title,
      body: article.body,
      description: article.description,
      createdAt: article.createdAt,
      author: {
        username: user.username,
        bio: profile.bio,
        image: profile.imageUrl
      }
    });
  }
};
