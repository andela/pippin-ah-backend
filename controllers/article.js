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
    const { title, tags = [] } = req.body;

    const authorId = req.decoded.id;
    const article = await Article.findOne(
      {
        where: { userId: authorId, title }
      });
    console.log('******', article.tags);

    if (!article.tags) {
      normalizedTags = tags;
    }
    console.log('#####', normalizedTags);
    if (article.tags) {
      normalizedTags = [
        ...new Set(article.tags.concat(tags))
      ];
    }

    console.log('******', typeof (article));
    await article
      .update({ tags: normalizedTags || article.title });
    return res.json({ message: `Tag added to ${article.title}` });
  },

  async getArticle(req, res) {
    const { slug } = req.params;
    const article = await Article.findOne({ where: { slug } });
    return res.json(article);
  }

};
