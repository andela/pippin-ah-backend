import 'babel-polyfill';
import models from '../models';

const { Article, User, Profile } = models;

/**
 * @class
 */
class Articles {
  /**
      * Represents getUser controller
      * @constructor
      * @param {object} req - The request object.
      * @param {object} res - The response object.
      * @param {object} next -The next middleware
      */
  static async createArticle(req, res) {
    const {
      title, body, description, category, slug
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
        title,
        body,
        description,
        category,
        slug,
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
}

export default Articles;