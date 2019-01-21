import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

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
      title: 'Post to test if article already exists',
      body: 'Article Body',
      description: 'Article Description',
      category: 'Science'
    };

    const responseObject = await chai.request(server).post('/api/v1/users')
      .send(userRequestObject);
    accesstoken = responseObject.body.token;

    await chai.request(server)
      .post('/api/v1/articles')
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
          .post('/api/v1/articles')
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
          .post('/api/v1/articles')
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
          .post('/api/v1/articles')
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
          title: 'Post to test if article already exists',
          body: 'Article Body',
          description: 'Article Description',
          category: 'Science'
        };
        const response = await chai.request(server)
          .post('/api/v1/articles')
          .send(articleObject)
          .set('Authorization', accesstoken);
        const errorResult = 'You already have an article with the same title';
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal(errorResult);
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
          .post('/api/v1/articles')
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
});
