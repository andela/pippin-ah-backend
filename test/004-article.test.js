import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

const baseUrl = '/api/v1/articles';

chai.use(chaiHttp);

describe('ARTICLE TEST SUITE', () => {
  let accesstoken;
  let firstArticleSlug;

  before(async () => {
    await models.sequelize.sync({ force: true });

    const userRequestObject = {
      username: 'davidhook',
      email: 'davidhook@hotmail.com',
      password: 'davidhook345'
    };

    const articleRequestObject = {
      title: 'Halt and Catch Fire',
      body: 'Article Body',
      description: 'Sci-fi movie',
      category: 'Science'
    };

    const responseObject = await chai.request(server).post('/api/v1/users')
      .send(userRequestObject);
    accesstoken = responseObject.body.token;

    const articleResponse = await chai.request(server)
      .post(baseUrl)
      .send(articleRequestObject)
      .set('Authorization', accesstoken);
    firstArticleSlug = articleResponse.body.slug;
  });

  describe('CREATE ARTICLE', () => {
    it('should not create an article when user is not logged in', async () => {
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

    it('should mandate required fields to create an article', async () => {
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

    it('should mandate non-empty fields to create an article', async () => {
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

    it('should not create an article if title already exists', async () => {
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

    it('should trim whitespaces before creating an article', async () => {
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

    it('should not create an article if category is invalid', async () => {
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

    it('should successfully create an article', async () => {
      const articleObject = {
        title: 'New Article',
        body: 'Article Body',
        description: 'Article Description',
        category: 'Science'
      };

      const response = await chai.request(server)
        .post(baseUrl)
        .set('Authorization', accesstoken)
        .send(articleObject);

      expect(response.status).to.equal(201);
      expect(response.body.title).to.equal('New Article');
      expect(response.body.description).to.equal('Article Description');
    });
  });

  describe('REPORT ARTICLE', () => {
    it('should successfully report an article', async () => {
      const articleObject = {
        report: 'Article has erotic content, its inappropriate'
      };

      const response = await chai.request(server)
        .post(`${baseUrl}/report/${firstArticleSlug}`)
        .set('Authorization', accesstoken)
        .send(articleObject);

      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal('Your report has been registered');
    });

    it('should allow a user report an article only once', async () => {
      const articleObject = {
        report: 'Article contains erotic content'
      };

      const response = await chai.request(server)
        .post(`${baseUrl}/report/${firstArticleSlug}`)
        .set('Authorization', accesstoken)
        .send(articleObject);
      expect(response.status).to.equal(409);
      expect(response.body.error).to.equal('Article already reported by you');
    });

    it('should not authorize request when no report supplied', async () => {
      const response = await chai.request(server)
        .post(`${baseUrl}/report/${firstArticleSlug}`)
        .set('Authorization', accesstoken)
        .send({});
      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal('Report is required');
    });

    it('should not authorize request when report is empty', async () => {
      const response = await chai.request(server)
        .post(`${baseUrl}/report/${firstArticleSlug}`)
        .set('Authorization', accesstoken)
        .send({ report: '' });
      expect(response.status).to.equal(400);
      // eslint-disable-next-line
      expect(response.body.error).to.equal('Report must have at least ten characters');
    });

    it('should not allow report for non existent article', async () => {
      const response = await chai.request(server)
        .post(`${baseUrl}/report/article-the-moon`)
        .set('Authorization', accesstoken)
        .send({ report: 'Extreme adult content' });
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal('Article provided does not exist');
    });
  });

  describe('Tag Article', () => {
    it('should add tag when valid values are entered', async () => {
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

    it('should not add tag when numbers are entered', async () => {
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

    it('should append tag to existing tag', async () => {
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
    it('should get an article', async () => {
      const response = await chai.request(server)
        .get(`${baseUrl}/${firstArticleSlug}`);

      expect(response.status).to.equal(200);
      expect(response.body.slug).to.equal('halt-and-catch-fire-davidhook');
    });

    it('should not get a non existent article', async () => {
      const response = await chai.request(server)
        .get('/api/v1/articles/non-existing-article');

      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal('Article provided does not exist');
    });
  });
});
