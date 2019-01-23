import models from '../models';
import { generateSlug } from '../helpers';

const { Article, User, Profile } = models;

export default {
  async createArticle(req, res) {
    const {
      title, body, description, category,
    } = req.body;

    const userId = req.decoded.id;
    const user = await User.findOne(
      {
        where: { id: userId },
        include: [{ model: Profile }]
      });

    const profile = user.Profile;
    const article = await Article
      .create({
        title: title.trim(),
        body: body.trim(),
        description: description.trim(),
        category: category.trim(),
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
  },

  async tagArticle(req, res) {
    const { tags, title } = req.body;

    const authorId = req.decoded.id;
    const userArticle = await Article.findOne(
      {
        where: { userId: authorId, title },
      });

    await userArticle
      .create({
        tags
      });

    return res.status(201).json({
      message: `Tag added to ${userArticle.title}`
    });
  }

};
