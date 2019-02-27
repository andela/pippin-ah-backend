import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

const baseUrl = '/api/v1';

describe('BOOKMARK TEST SUITE', () => {
  let accessToken;
  let firstArticleSlug;
  let secondArticleSlug;

  before(async () => {
    await models.sequelize.sync({ force: true });

    const userRequestObject = {
      username: 'JohnDoe',
      email: 'john@doe.com',
      password: 'john26354'
    };

    const firstArticleRequestObject = {
      title: 'The new boston',
      body: 'Bucky rubert is the only person you hear in the newboston',
      description: 'Article Description for get all authors',
      category: 'Arts'
    };

    const secondArticleRequestObject = {
      title: 'What school never taught me',
      body: 'There was a time school meant education',
      description: 'It already failed',
      category: 'Arts'
    };

    const responseObject = await chai.request(server)
      .post(`${baseUrl}/users`)
      .send(userRequestObject);
    accessToken = responseObject.body.token;

    const firstArticleResponse = await chai.request(server)
      .post(`${baseUrl}/articles`)
      .send(firstArticleRequestObject)
      .set('Authorization', accessToken);
    firstArticleSlug = firstArticleResponse.body.slug;

    const secondArticleResponse = await chai.request(server)
      .post(`${baseUrl}/articles`)
      .send(secondArticleRequestObject)
      .set('Authorization', accessToken);
    secondArticleSlug = secondArticleResponse.body.slug;
  });

  describe('BOOKMARK AN ARTICLE', () => {
    it('Should not bookmark an article when the slug does not exist',
      async () => {
        const response = await chai.request(server)
          .post(`${baseUrl}/articles/bookmarks/the-new-looks`)
          .set('Authorization', accessToken);
        expect(response.status).to.equal(404);
        expect(response.body).to.have.deep.property('error');
        expect(response.body.error).to.equal('Article does not exist!');
      }
    );

    it('should bookmark article when slug exists', async () => {
      const response = await chai.request(server)
        .post(`${baseUrl}/articles/bookmarks/${firstArticleSlug}`)
        .set('Authorization', accessToken);
      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal('Bookmark successful!');
    });

    it('should not bookmark if already bookmarked', async () => {
      const response = await chai.request(server)
        .post(`${baseUrl}/articles/bookmarks/${firstArticleSlug}`)
        .set('Authorization', accessToken);
      expect(response.status).to.equal(401);
      expect(response.body.error)
        .to.equal('This Article is already bookmarked!');
    });

    it('should not delete a bookmark if it does not exist', async () => {
      const response = await chai.request(server)
        .delete(`${baseUrl}/articles/bookmarks/${secondArticleSlug}`)
        .set('Authorization', accessToken);
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal('This Article is not bookmarked!');
    });

    it('should get a user\'s bookmarks',
      async () => {
        const response = await chai.request(server)
          .get(`${baseUrl}/articles/bookmarks`)
          .set('Authorization', accessToken);
        expect(response.status).to.equal(200);
        expect(response.body.bookmarks[0].title).to.equal('The new boston');
      }
    );

    it('should not remove bookmark if article does not exist',
      async () => {
        const response = await chai.request(server)
          .delete(`${baseUrl}/articles/bookmarks/time-shall-tell-for-perfection`)
          .set('Authorization', accessToken);
        expect(response.status).to.equal(404);
        expect(response.body).to.have.deep.property('error');
        expect(response.body.error).to.equal('Article does not exist!');
      }
    );
  });
});
