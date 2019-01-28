import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

const baseUrl = '/api/v1';
const { Article } = models;

describe('BOOKMARK TEST SUITE', () => {
  let accessToken;

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

    const responseObject = await chai.request(server).post(`${baseUrl}/users`)
      .send(userRequestObject);
    accessToken = responseObject.body.token;
    await chai.request(server)
      .post(`${baseUrl}/articles`)
      .send(articleRequestObject)
      .set('Authorization', accessToken);
  });

  describe('BOOKMARK AN ARTICLE', () => {
    // eslint-disable-next-line max-len
    it('Should not bookmark an article when article the specified slug does not exist',
      async () => {
        const response = await chai.request(server)
          .post(`${baseUrl}/articles/bookmarks/the-new-looks`)
          .set('Authorization', accessToken);
        expect(response.status).to.equal(400);
        expect(response.body).to.have.deep.property('error');
        expect(response.body.error).to.equal('No article with such Slug');
      }
    );

    it('should bookmark article when article with the specified slug exist',
      async () => {
        const result = await Article.findOne({
          where: {
            category: 'Arts'
          },
        });

        const { slug } = result.dataValues;
        const response = await chai.request(server)
          .post(`${baseUrl}/articles/bookmarks/${slug}`)
          .set('Authorization', accessToken);
        expect(response.status).to.equal(201);
        expect(response.body.bookmarked).to.equal(true);
        expect(response.body.bookmarked).to.equal(true);
        expect(response.body).to.have.deep.property('bookmarkedBy');
      }
    );

    it('should get array of slug from bookmarked articles',
      async () => {
        const response = await chai.request(server)
          .get(`${baseUrl}/articles/bookmarks`)
          .set('Authorization', accessToken);
        expect(response.status).to.equal(200);
        expect(response.body[0]).to.equal('the-new-boston-JohnDoe');
      }
    );

    it('should not update bookmark article when article slug is incorrect',
      async () => {
        const slug = 'time-shall-tell-for-perfection';

        const response = await chai.request(server)
          .patch(`${baseUrl}/articles/bookmarks/${slug}`)
          .set('Authorization', accessToken);
        expect(response.status).to.equal(400);
        expect(response.body).to.have.deep.property('error');
        expect(response.body.error).to.equal('No article with such Slug');
      }
    );

    it('should bookmark article when article slug is correct',
      async () => {
        const result = await Article.findOne({
          where: {
            category: 'Arts'
          },
        });

        const { slug } = result.dataValues;
        const response = await chai.request(server)
          .patch(`${baseUrl}/articles/bookmarks/${slug}`)
          .set('Authorization', accessToken);
        expect(response.status).to.equal(200);
        expect(response).to.have.deep.property('text');
        expect(response.text).to.equal('Unbookmarked Successfully');
      }
    );
  });
});
