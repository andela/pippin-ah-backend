import dateFns from 'date-fns';
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
        slug: `${generateSlug(title)}-${user.username}`,
        userId,
      });

    return res.status(201).json({
      title: article.title,
      body: article.body,
      description: article.description,
      slug: article.slug,
      createdAt: article.createdAt,
      author: {
        username: user.username,
        bio: profile.bio,
        image: profile.imageUrl
      }
    });
  },

  async tagArticle(req, res) {
    let normalizedTags;
    const { title, tags } = req.body;

    const { id: userId } = req.decoded;
    const article = await Article.findOne({ where: { userId, title } });

    normalizedTags = [tags.trim().toLowerCase()];

    if (article.tags) {
      normalizedTags = [
        ...new Set(article.tags.concat(tags.trim().toLowerCase()))
      ];
    }

    await article.update({ tags: normalizedTags });
    return res.sendStatus(200);
  },

  async getArticleByCategory(req, res) {
    const { category } = req.query;

    const article = await Article.findAll({
      where: {
        category
      },
      include: [{
        model: User,
        attributes: ['username'],
        include: [
          {
            model: Profile,
            attributes: [
              'firstName',
              'lastName',
              'bio',
              'imageUrl'
            ]
          }
        ]
      }]
    });
    const responseArray = article.map(item => ({
      author: item.User.username,
      firstName: item.User.Profile.firstName,
      lastName: item.User.Profile.lastName,
      bio: item.User.Profile.bio,
      imageUrl: item.User.Profile.imageUrl,
      title: item.title,
      description: item.description,
      body: item.body,
      createdOn: dateFns.format(new Date(item.createdAt), 'D MMMM YYYY, h:ssA'),
      modifiedOn: dateFns.format(new Date(item.updatedAt), 'D MMMM YYYY, h:ssA')
    })
    );
    return res.send(responseArray);
  },

  async getArticle(req, res) {
    const { slug } = req.params;
    const article = await Article.findOne({ where: { slug } });
    return res.json(article);
  },
  async getArticleByCategory(req, res) {
    const { category } = req.query;

    const article = await Article.findAll({
      where: {
        category
      },
      include: [{
        model: User,
        attributes: ['username'],
        include: [
          {
            model: Profile,
            attributes: [
              'firstName',
              'lastName',
              'bio',
              'imageUrl'
            ]
          }
        ]
      }]
    });
    const responseArray = article.map(item => ({
      author: item.User.username,
      firstName: item.User.Profile.firstName,
      lastName: item.User.Profile.lastName,
      bio: item.User.Profile.bio,
      imageUrl: item.User.Profile.imageUrl,
      title: item.title,
      description: item.description,
      body: item.body,
      createdOn: dateFns.format(new Date(item.createdAt), 'D MMMM YYYY, h:ssA'),
      modifiedOn: dateFns.format(new Date(item.updatedAt), 'D MMMM YYYY, h:ssA')
    })
    );
    return res.send(responseArray);
  }
};
