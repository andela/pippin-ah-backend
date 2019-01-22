import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

describe('COMMENT TEST SUITE', () => {
  let accesstoken;
  let slug;
  const comment = 'This is in insightful article';
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
    slug = 'post-to-test-if-article-already-exists';
    const responseObject = await chai.request(server).post('/api/v1/users')
      .send(userRequestObject);
    accesstoken = responseObject.body.token;

    await chai.request(server)
      .post('/api/v1/articles')
      .send(articleRequestObject)
      .set('Authorization', accesstoken);
  });

  describe('Add Comment To Article', () => {
    it('should not authorize comment entry if no token is provided',
      async () => {
        const response = await chai.request(server)
          .post(`/api/v1/articles/${slug}/comments`)
          .send({ comment });
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('No token provided');
      });

    it('should not authorize comment entry if invalid token is provided',
      async () => {
        const response = await chai.request(server)
          .post(`/api/v1/articles/${slug}/comments`)
          .set('Authorization', 'invalid token')
          .send({ comment });
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('Invalid token');
      });

    it('should respond with 400 error if comment field is not provided',
      async () => {
        const response = await chai.request(server)
          .post(`/api/v1/articles/${slug}/comments`)
          .set('Authorization', accesstoken);
        expect(response.status).to.equal(400);
        expect(response.body.error)
          .to.equal('comment params is missing, empty or invalid');
      });

    it('should respond with 400 error if the comment supplied is not a string',
      async () => {
        const response = await chai.request(server)
          .post(`/api/v1/articles/${slug}/comments`)
          .set('Authorization', accesstoken)
          .send([]);
        expect(response.status).to.equal(400);
        expect(response.body.error)
          .to.equal('comment params is missing, empty or invalid');
      });

    it('should not allow comment entries greater than 1000 characters',
      async () => {
        const response = await chai.request(server)
          .post(`/api/v1/articles/${slug}/comments`)
          .set('Authorization', accesstoken)
          .send({
            comment: 'x'.repeat(1001)
          });
        expect(response.status).to.equal(400);
        expect(response.body.error)
          .to.equal('comment is greater than 1000 characters');
      });

    it('should not permit comment entry for non-existent articles',
      async () => {
        const response = await chai.request(server)
          .post('/api/v1/articles/noArticle/comments')
          .set('Authorization', accesstoken)
          .send({ comment });
        expect(response.status).to.equal(404);
        expect(response.body.error)
          .to.equal('Article provided does not exist');
      });

    it('should add comment entry with valid parameters',
      async () => {
        const response = await chai.request(server)
          .post(`/api/v1/articles/${slug}/comments`)
          .set('Authorization', accesstoken)
          .send({ comment });
        expect(response.status).to.equal(200);
        expect(response.body.comment)
          .to.equal(comment);
      });
  });
});
