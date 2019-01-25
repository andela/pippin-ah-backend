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

  describe('Report Article', () => {
    it('should be able to report an article',
      async () => {
        const articleObject = {
          report: 'Article has erotic content, its inappropriate'
        };

        const response = await chai.request(server)
          .post(`${baseUrl}/report/halt-and-catch-fire-newusername`)
          .set('Authorization', accesstoken)
          .send(articleObject);
        expect(response.status).to.equal(201);
        // eslint-disable-next-line
        expect(response.body.message).to.equal('You report has been registered');
      });

    it('should not be able to report an article more than one',
      async () => {
        const articleObject = {
          report: 'Article has not been deleted, I said it contain erotic'
        };

        const response = await chai.request(server)
          .post(`${baseUrl}/report/halt-and-catch-fire-newusername`)
          .set('Authorization', accesstoken)
          .send(articleObject);
        expect(response.status).to.equal(409);
        expect(response.body.error).to.equal('Article already reported by you');
      });

    it('should throw an error if required field not provided',
      async () => {
        const response = await chai.request(server)
          .post(`${baseUrl}/report/halt-and-catch-fire-newusername`)
          .set('Authorization', accesstoken)
          .send({});
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('Report is required');
      });

    it('should throw an error when article do not exist',
      async () => {
        const response = await chai.request(server)
          .post(`${baseUrl}/report/halt-and-catch-fire-invalidusername`)
          .set('Authorization', accesstoken)
          .send({});
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('Article provided does not exist');
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
      });

    it('should not add tag when numbers are entered',
      async () => {
        const articleObject = {
          title: 'New Article',
          tags: 678899900000,
        };
        const response = await chai.request(server)
          .patch(`${baseUrl}/tag`)
          .set('Authorization', accesstoken)
          .send(articleObject);
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('tag must be a string');
      });

    it('should append tag to existing tag',
      async () => {
        const articleObject = {
          title: 'New Article',
          tags: 'Article Body Two',
        };
        const response = await chai.request(server)
          .patch(`${baseUrl}/tag`)
          .set('Authorization', accesstoken)
          .send(articleObject);
        expect(response.status).to.equal(200);
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

  describe('Get Article by category', () => {
    it('should not get article when the category does not match',
      async () => {
        const response = await chai.request(server)
          .get('/api/v1/articles/categories?category=sciences')
          .set('Authorization', accesstoken);
        expect(response.status).to.equal(400);
        expect(response.body).to.have.deep.property('error');
        expect(response.body.error).to.equal('Invalid category sciences');
      });

    it('should return empty array when category is undefined',
      async () => {
        const response = await chai.request(server)
          .get('/api/v1/articles/categories?')
          .set('Authorization', accesstoken);
        expect(response.status).to.equal(200);
        // eslint-disable-next-line no-unused-expressions
        expect(response.body).to.be.an('array').that.is.empty;
        expect(Array.isArray(response.body)).to.equal(true);
      });

    it('should get article when the category matches',
      async () => {
        const response = await chai.request(server)
          .get('/api/v1/articles/categories?category=Science')
          .set('Authorization', accesstoken);
        expect(response.status).to.equal(200);
        expect(response.body[0].author).to.equal('newusername');
        expect(response.body[0].firstName).to.equal(null);
        expect(response.body[0].title)
          .to.equal('Halt and Catch Fire');
        expect(response.body[0].body).to.equal('Article Body');
        expect(response.body[0]).to.have.deep.property('createdOn');
        expect(response.body[0]).to.have.deep.property('modifiedOn');
      });
  });
});
