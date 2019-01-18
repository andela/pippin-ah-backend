import 'babel-polyfill';
import models from '../models';

const { Article } = models;

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
      title, body, description, category
    } = req.body;

    const userId = req.decoded.id;
    const article = await Article
      .create({
        title,
        body,
        description,
        category,
        userId,
      });
    return res.status(201).json({
      title: article.title,
      body: article.body,
      description: article.description,
      createdAt: article.createdAt
    });
  }
}

export default Articles;
