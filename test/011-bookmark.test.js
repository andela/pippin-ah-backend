import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

const baseUrl = '/api/v1';

describe('BOOKMARK TEST SUITE', () => {
  let accessToken;
  let createdSlug;

  before(async () => {
    await models.sequelize.sync({ force: true });

    const userRequestObject = {
      username: 'JohnDoe',
      email: 'john@doe.com',
      password: 'john26354'
    };

    const articleRequestObject = {
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
    // eslint-disable-next-line max-len
    it('Should not bookmark an article when the slug does not exist',
      async () => {
        const response = await chai.request(server)
          .post(`${baseUrl}/articles/bookmarks/the-new-looks`)
          .set('Authorization', accessToken);
        expect(response.status).to.equal(400);
        expect(response.body).to.have.deep.property('error');
        expect(response.body.error).to.equal('Article does not exist');
      }
    );

    it('should bookmark article when slug exists', async () => {
      const response = await chai.request(server)
        .post(`${baseUrl}/articles/bookmarks/${createdSlug}`)
        .set('Authorization', accessToken);
      expect(response.status).to.equal(201);
    }
    );

    it('should get array of slugs from bookmarked articles',
      async () => {
        const response = await chai.request(server)
          .get(`${baseUrl}/articles/bookmarks`)
          .set('Authorization', accessToken);
        expect(response.status).to.equal(200);
        expect(response.body[0]).to.equal('the-new-boston-JohnDoe');
      }
    );

    // eslint-disable-next-line
    it('should not remove article from list of bookmarked articles when article slug does not exist',
      async () => {
        const response = await chai.request(server)
          .patch(`${baseUrl}/articles/bookmarks/time-shall-tell-for-perfection`)
          .set('Authorization', accessToken);
        expect(response.status).to.equal(400);
        expect(response.body).to.have.deep.property('error');
        expect(response.body.error).to.equal('Article does not exist');
      }
    );

    it('should bookmark article when article slug exists',
      async () => {
        const response = await chai.request(server)
          .patch(`${baseUrl}/articles/bookmarks/${createdSlug}`)
          .set('Authorization', accessToken);
        expect(response.status).to.equal(200);
      }
    );

    it('should return array of slugs for bookmarked articles',
      async () => {
        const response = await chai.request(server)
          .get(`${baseUrl}/articles/bookmarks`)
          .set('Authorization', accessToken);
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(0);
      }
    );
  });
});
