import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

const baseUrl = '/api/v1/articles';

chai.use(chaiHttp);

describe('ARTICLE TEST SUITE', () => {
  let accesstoken;
  before(async () => {
    await models.sequelize.sync({ force: true });

    const userRequestObject = {
      username: 'newusername',
      email: 'newaddress@email.com',
      password: 'newpassword'
    };
    const articleRequestObject = {
      title: 'Halt and Catch Fire',
      body: 'Article Body',
      description: 'Article Description',
      category: 'Science'
    };

    const responseObject = await chai.request(server).post('/api/v1/users')
      .send(userRequestObject);
    accesstoken = responseObject.body.token;

    await chai.request(server)
      .post(baseUrl)
      .send(articleRequestObject)
      .set('Authorization', accesstoken);
  });

  describe('Create Article', () => {
    it('should not create an article when user is not logged in',
      async () => {
        const articleObject = {
          title: 'New Article',
          body: 'Article Content',
          description: 'Article Description',
          category: 'Science'
        };
        const response = await chai.request(server)
          .post(baseUrl)
          .send(articleObject);
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('No token provided');
      });

    it('should not create an article when required fields are not provided',
      async () => {
        const articleObject = {
          description: 'Article Description',
          category: 'Science'
        };
        const response = await chai.request(server)
          .post(baseUrl)
          .send(articleObject)
          .set('Authorization', accesstoken);
        const errorResult = JSON.parse(response.body.error);
        expect(response.status).to.equal(400);
        expect(errorResult[0]).to.equal('title is required');
        expect(errorResult[1]).to.equal('body is required');
      });

    it('should not create an article when required fields are empty',
      async () => {
        const articleObject = {
          title: '',
          body: '',
          description: 'Article Description',
          category: 'Article Category'
        };
        const response = await chai.request(server)
          .post(baseUrl)
          .send(articleObject)
          .set('Authorization', accesstoken);
        const errorResult = JSON.parse(response.body.error);
        expect(response.status).to.equal(400);
        expect(errorResult[0]).to.equal('title must not be empty');
        expect(errorResult[1]).to.equal('body must not be empty');
      });

    it('should not create an article if title alreasy exists',
      async () => {
        const articleObject = {
          title: 'Halt and Catch Fire ',
          body: 'Article Body',
          description: 'Article Description',
          category: 'Science'
        };
        const response = await chai.request(server)
          .post(baseUrl)
          .send(articleObject)
          .set('Authorization', accesstoken);
        const errorResult = 'You already have an article with the same title';
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal(errorResult);
      });

    it('should trim spaces at the begining and ending of the title',
      async () => {
        const articleObject = {
          title: '   Test Space Trimming    ',
          body: 'Article Body',
          description: 'Article Description',
          category: 'Science'
        };
        const response = await chai.request(server)
          .post(baseUrl)
          .send(articleObject)
          .set('Authorization', accesstoken);
        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal('Test Space Trimming');
      });

    it('should not create an article if category is invalid',
      async () => {
        const articleObject = {
          title: ' New Article Title    ',
          body: 'Article Body',
          description: 'Article Description',
          category: 'Travel'
        };

        const response = await chai.request(server)
          .post('/api/v1/articles')
          .send(articleObject)
          .set('Authorization', accesstoken);
        expect(response.status).to.equal(400);
        expect(response.body.error.split(' ')[2]).to.equal('[Travel].');
      });

    it('should create an article when required fields are provided',
      (done) => {
        const articleObject = {
          title: 'New Article',
          body: 'Article Body',
          description: 'Article Description',
          category: 'Science'
        };
        chai.request(server)
          .post(baseUrl)
          .set('Authorization', accesstoken)
          .send(articleObject)
          .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body.title).to.equal('New Article');
            expect(res.body.description).to.equal('Article Description');
            done();
          });
      });
  });

  describe('Tag Article', () => {
    it('should add  tag when valid values are entered',
      async () => {
        const articleObject = {
          title: 'New Article',
          tags: 'Article Body'
        };
        const response = await chai.request(server)
          .patch(`${baseUrl}/tag`)
          .set('Authorization', accesstoken)
          .send(articleObject);
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal(
          `Tag added to ${response.title}`
        );
      });
    it('should not tag an article when title fields is empty',
      async () => {
        const articleObject = {
          title: '',
          tags: 'Article Body'
        };
        const response = await chai.request(server)
          .patch(`${baseUrl}/tag`)
          .set('Authorization', accesstoken)
          .send(articleObject);
        const errorResult = JSON.parse(response.body.error);
        expect(response.status).to.equal(400);
        expect(errorResult[0]).to.equal('title must not be empty');
      });
    it('should not tag an article when tags fields are empty',
      async () => {
        const articleObject = {
          tags: '',
          title: 'Article Body'
        };
        const response = await chai.request(server)
          .patch(`${baseUrl}/tag`)
          .set('Authorization', accesstoken)
          .send(articleObject);
        const errorResult = JSON.parse(response.body.error);
        expect(response.status).to.equal(400);
        expect(errorResult[0]).to.equal('tags must not be empty');
      });
  });
  describe('Get Article', () => {
    it('should get an article',
      async () => {
        const response = await chai.request(server)
          .get('/api/v1/articles/halt-and-catch-fire-newusername');
        expect(response.status).to.equal(200);
        expect(response.body.slug).to.equal('halt-and-catch-fire-newusername');
      });
    it('should return an error if article does not exist',
      async () => {
        const response = await chai.request(server)
          .get('/api/v1/articles/non-existing-article');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('Article provided does not exist');
      });
  });
});
