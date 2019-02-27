import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

const baseUrl = '/api/v1';

describe('BOOKMARK TEST SUITE', () => {
  let accessToken;
  let createdSlug;
  let articleRequestObject;

  before(async () => {
    await models.sequelize.sync({ force: true });

    const userRequestObject = {
      username: 'JohnDoe',
      email: 'john@doe.com',
      password: 'john26354'
    };

    articleRequestObject = {
      title: 'The new boston',
      body: 'Bucky rubert is the only person you hear in the newboston',
      description: 'Article Description for get all authors',
      category: 'Arts'
    };

    const responseObject = await chai.request(server)
      .post(`${baseUrl}/users`)
      .send(userRequestObject);
    accessToken = responseObject.body.token;

    const articleResponse = await chai.request(server)
      .post(`${baseUrl}/articles`)
      .send(articleRequestObject)
      .set('Authorization', accessToken);
    createdSlug = articleResponse.body.slug;
  });

  describe('BOOKMARK AN ARTICLE', () => {
    it('Should not bookmark an article when the slug does not exist',
      async () => {
        const response = await chai.request(server)
          .post(`${baseUrl}/articles/bookmark/the-new-looks`)
          .set('Authorization', accessToken);
        expect(response.status).to.equal(404);
        expect(response.body).to.have.deep.property('error');
        expect(response.body.error).to.equal('Article does not exist!');
      }
    );

    it('should bookmark article when slug exists', async () => {
      const response = await chai.request(server)
        .post(`${baseUrl}/articles/bookmark/${createdSlug}`)
        .set('Authorization', accessToken);
      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal('Bookmark successful!');
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

    it('should not remove bookmark if it does not exist',
      async () => {
        const response = await chai.request(server)
          .delete(`${baseUrl}/articles/bookmark/time-shall-tell-for-perfection`)
          .set('Authorization', accessToken);
        expect(response.status).to.equal(404);
        expect(response.body).to.have.deep.property('error');
        expect(response.body.error).to.equal('Article does not exist!');
      }
    );
  });
});
