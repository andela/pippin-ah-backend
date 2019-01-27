import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

describe('COMMENT TEST SUITE', () => {
  let firstUserToken, secondUserToken, slug;
  const firstComment = 'This is an insightful article';
  const secondComment = 'What a lovely way to put it!';
  before(async () => {
    await models.sequelize.sync({ force: true });

    const firstUserRequestObject = {
      username: 'homersimpson',
      email: 'homersimpson@email.com',
      password: 'homerlisa'
    };
    const secondUserRequestObject = {
      username: 'bartsimpson',
      email: 'bartsimpson@email.com',
      password: 'bartburns'
    };
    const articleRequestObject = {
      title: 'Post to test if article already exists',
      body: 'Article Body',
      description: 'Article Description',
      category: 'Science'
    };
    const firstUserResponseObject = await chai
      .request(server).post('/api/v1/users')
      .send(firstUserRequestObject);
    firstUserToken = firstUserResponseObject.body.token;

    const secondUserResponseObject = await chai
      .request(server).post('/api/v1/users')
      .send(secondUserRequestObject);
    secondUserToken = secondUserResponseObject.body.token;

    const newArticle = await chai.request(server)
      .post('/api/v1/articles')
      .send(articleRequestObject)
      .set('Authorization', firstUserToken);
    ({ slug } = newArticle.body);

    const articleComment = await chai.request(server)
      .post(`/api/v1/articles/${slug}/comments`)
      .set('Authorization', secondUserToken)
      .send({ secondComment });
    const secondCommentID = articleComment.id;
  });

  describe('Add Comment To Article', () => {
    it('should not authorize comment entry if no token is provided',
      async () => {
        const response = await chai.request(server)
          .post(`/api/v1/articles/${slug}/comments`)
          .send({ firstComment });
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('No token provided');
      });

    it('should not authorize comment entry if invalid token is provided',
      async () => {
        const response = await chai.request(server)
          .post(`/api/v1/articles/${slug}/comments`)
          .set('Authorization', 'invalid token')
          .send({ firstComment });
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
          .send({ firstComment });
        expect(response.status).to.equal(404);
        expect(response.body.error)
          .to.equal('Article provided does not exist');
      });

    it('should add comment entry with valid parameters',
      async () => {
        const response = await chai.request(server)
          .post(`/api/v1/articles/${slug}/comments`)
          .set('Authorization', accesstoken)
          .send({ firstComment });
        expect(response.status).to.equal(200);
        expect(response.body.comment)
          .to.equal(comment);
      });
  });
  describe('Edit Comment', () => {
    it('should respond with 400 error if newComment field is not provided',
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
          .send({ firstComment });
        expect(response.status).to.equal(404);
        expect(response.body.error)
          .to.equal('Article provided does not exist');
      });

    it('should add comment entry with valid parameters',
      async () => {
        const response = await chai.request(server)
          .post(`/api/v1/articles/${slug}/comments`)
          .set('Authorization', accesstoken)
          .send({ firstComment });
        expect(response.status).to.equal(200);
        expect(response.body.comment)
          .to.equal(comment);
      });
  });
});
