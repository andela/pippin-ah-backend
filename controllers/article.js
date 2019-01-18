import Sequelize from 'sequelize';
import 'babel-polyfill';
import models from '../models';

const { User, Article } = models;

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
    const { title, body, description } = req.body;
    const article = await Article
      .create({
        title,
        body,
        description,
      });
    return res.status(201).json({
      title: article.title,
      body: article.body,
      description: article.description
    });
  }
}
