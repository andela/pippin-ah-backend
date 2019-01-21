import models from '../models';

const { Article, User, Profile } = models;

export default {
  allUsers: async () => {
    const authors = await Article.findAll({
      include: [{
        model: User,
        attributes: ['username'],
        include: [
          {
            model: Profile,
            attributes: [
              'lastName',
              'firstName',
              'bio',
              'category',
              'imageUrl'
            ]
          }
        ]
      }]
    });
    return authors;
  }
};
