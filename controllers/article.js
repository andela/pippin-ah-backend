import Sequelize from 'sequelize';
import dateFns from 'date-fns';
import models from '../models';
import { Notifier } from '../services';
import { generateSlug, getReadTime, categories } from '../helpers';

const {
  Article,
  User,
  Profile,
  Report,
  Bookmark,
  Follow,
  Comment
} = models;
const {
  iLike,
  and,
  or,
  notIn,
  contains
} = Sequelize.Op;

export default {
  async createArticle(req, res) {
    const {
      title, body, description, category, coverImageUrl
    } = req.body;

    let imgUrl;
    if (coverImageUrl) {
      imgUrl = coverImageUrl;
    } else {
      imgUrl = '';
    }

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
        coverImageUrl: imgUrl.trim(),
        slug: `${generateSlug(title)}-${user.username}`,
        userId,
        readTime: getReadTime(body.trim())
      });

    const followersIdArray = await Follow.findAll({
      where: { userId },
      attributes: ['followerId']
    });

    followersIdArray.forEach((followerId) => {
      Notifier.notifyFollowersOfNewArticle(
        followerId.followerId,
        userId, article.title
      );
    });

    return res.status(201).json({
      title: article.title,
      body: article.body,
      description: article.description,
      slug: article.slug,
      rating: article.rating,
      coverImageUrl: article.coverImageUrl,
      createdAt: article.createdAt,
      readTime: article.readTime,
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

  async reportArticle(req, res) {
    const {
      body: { report },
      params: { slug },
      decoded: { id: userId }
    } = req;

    const article = await Article.findOne({ where: { slug } });
    const normalizedReport = report.trim().replace(/  +/g, ' ');

    await Report.create({
      report: normalizedReport,
      articleId: article.id,
      userId
    });

    return res.status(201).send({ message: 'Your report has been registered' });
  },

  async getArticles(req, res) {
    const {
      category,
      author,
      tag,
      keywords,
      limit = 50
    } = req.query;

    let offset, { page } = req.query;
    page = Number(page);

    const queryArray = [{
      [or]: {
        title: { [iLike]: keywords ? `%${keywords}%` : '%' },
        description: { [iLike]: keywords ? `%${keywords}%` : '%' },
        body: { [iLike]: keywords ? `%${keywords}%` : '%' }
      },
    },
    { category: category || categories },
    { tags: tag ? { [contains]: [tag] } : { [notIn]: [] } }];
    if (author) {
      queryArray.push({
        [or]: {
          '$User.Profile.lastName$': { [iLike]: `%${author}%` },
          '$User.Profile.firstName$': { [iLike]: `%${author}%` },
          '$User.username$': { [iLike]: `%${author}%` },
        }
      });
    }
    offset = limit * (page - 1);
    if (!page || page < 1) {
      offset = 0; page = 1;
    }
    const articles = await Article.findAll({
      order: [['createdAt', 'DESC']],
      where: { [and]: queryArray },
      limit,
      offset,
      include: [{
        model: User,
        required: false,
        include: [{
          model: Profile,
          required: false,
        }]
      }]
    });

    const responseArray = articles.map(item => ({
      author: item.User.username,
      slug: item.slug,
      firstName: item.User.Profile.firstName,
      lastName: item.User.Profile.lastName,
      bio: item.User.Profile.bio,
      imageUrl: item.User.Profile.imageUrl,
      title: item.title,
      description: item.description,
      category: item.category,
      body: item.body,
      readTime: item.readTime,
      coverImageUrl: item.coverImageUrl,
      createdOn: dateFns.format(new Date(item.createdAt), 'D MMMM YYYY, h:ssA'),
      modifiedOn: dateFns.format(new Date(item.updatedAt), 'D MMMM YYYY, h:ssA')
    })
    );
    return res.json({
      articles: responseArray,
      count: articles.length,
      page
    });
  },

  async getArticleBySlug(req, res) {
    const { slug } = req.params;
    const article = await Article.findOne({
      where: { slug },
      include: [{
        model: Comment,
        required: false,
        attributes: ['id', 'userId', 'comment']
      }]
    });

    const response = {
      id: article.id,
      title: article.title,
      body: article.body,
      description: article.description,
      coverImageUrl: article.coverImageUrl,
      tags: article.tags,
      slug: article.slug,
      rating: article.rating,
      aveRating: article.aveRating,
      category: article.category,
      readTime: article.readTime,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      comments: article.Comments
    };

    return res.json(response);
  },

  async bookmarkArticle(req, res) {
    const {
      params: { slug },
      decoded: { id: userId }
    } = req;

    const article = await Article.findOne({ where: { slug } });
    const articleId = article.id;

    const bookmarkedBy = userId;
    const bookmarked = true;

    await Bookmark.create({ articleId, bookmarkedBy, bookmarked });

    return res.sendStatus(201);
  },

  async removeBookmarkedArticle(req, res) {
    const {
      decoded: { id: userId },
      params: { slug }
    } = req;

    const article = await Article.findOne({ where: { slug } });
    const articleId = article.id;

    const bookmark = await Bookmark.findOne({
      where: { articleId, bookmarkedBy: userId }
    });

    await bookmark.update({ bookmarked: false });
    return res.sendStatus(200);
  },

  async getBookmarkedArticles(req, res) {
    const { id: bookmarkedBy } = req.decoded;

    const bookmarkedArticles = await Bookmark
      .findAll({
        where: { bookmarkedBy, bookmarked: true },
        include: [{
          model: Article,
          attributes: ['slug'],
        }],
      });

    const slugArray = bookmarkedArticles.map(item => item.Article.slug);
    return res.send(slugArray);
  },

  async shareArticle(req, res) {
    const { slug } = req.params;
    const { provider } = req.params;
    const articleUrl = `${req.get('host')}/api/v1/articles/${slug}`;
    let shareUrl, fbShareUrl;

    switch (provider) {
      default:
        return res.redirect(400, articleUrl);
      case 'twitter':
        shareUrl = `https://twitter.com/home?status=http%3A//${articleUrl}`;
        break;
      case 'facebook':
        fbShareUrl = 'https://www.facebook.com/sharer/sharer.php?u=https%3A/';
        shareUrl = `${fbShareUrl}/${articleUrl}`;
        break;
      case 'googleplus':
        shareUrl = `https://plus.google.com/share?url=http%3A//${articleUrl}`;
        break;
    }

    return res.redirect(shareUrl);
  }
};
