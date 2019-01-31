import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

describe('COMMENT TEST SUITE', () => {
  let slug;
  let firstUserToken, secondUserToken, secondCommentID;
  const firstComment = 'This is an insightful article';
  const secondComment = 'What a lovely way to put it!';
  const thirdComment = 'This got me really thinking.';

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
      .send({ comment: secondComment });
    secondCommentID = articleComment.body.id;
  });

  describe('Add Comment To Article', () => {
    it('should not authorize comment entry if no token is provided',
      async () => {
        const response = await chai.request(server)
          .post(`/api/v1/articles/${slug}/comments`)
          .send({ comment: firstComment });
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('No token provided');
      });

    it('should not authorize comment entry if invalid token is provided',
      async () => {
        const response = await chai.request(server)
          .post(`/api/v1/articles/${slug}/comments`)
          .set('Authorization', 'invalid token')
          .send({ comment: firstComment });
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('Invalid token');
      });

    it('should respond with 400 error if comment field is not provided',
      async () => {
        const response = await chai.request(server)
          .post(`/api/v1/articles/${slug}/comments`)
          .set('Authorization', firstUserToken);
        expect(response.status).to.equal(400);
        expect(response.body.error)
          .to.equal('comment params is missing, empty or invalid');
      });

    it('should respond with 400 error if the comment supplied is not a string',
      async () => {
        const response = await chai.request(server)
          .post(`/api/v1/articles/${slug}/comments`)
          .set('Authorization', firstUserToken)
          .send([]);
        expect(response.status).to.equal(400);
        expect(response.body.error)
          .to.equal('comment params is missing, empty or invalid');
      });

    it('should not allow comment entries greater than 1000 characters',
      async () => {
        const response = await chai.request(server)
          .post(`/api/v1/articles/${slug}/comments`)
          .set('Authorization', firstUserToken)
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
          .set('Authorization', firstUserToken)
          .send({ comment: firstComment });
        expect(response.status).to.equal(404);
        expect(response.body.error)
          .to.equal('Article provided does not exist');
      });

    it('should add comment entry with valid parameters',
      async () => {
        const response = await chai.request(server)
          .post(`/api/v1/articles/${slug}/comments`)
          .set('Authorization', firstUserToken)
          .send({ comment: firstComment });
        expect(response.status).to.equal(200);
        expect(response.body.comment)
          .to.equal(firstComment);
      });

    it('should not allow duplicate comment by user',
      async () => {
        const response = await chai.request(server)
          .post(`/api/v1/articles/${slug}/comments`)
          .set('Authorization', firstUserToken)
          .send({ comment: firstComment });
        expect(response.status).to.equal(400);
        expect(response.body.error)
          .to.equal('You\'ve already posted this comment');
      });
  });

  describe('Edit Comment', () => {
    it('should respond with 404 error if comment does not exist',
      async () => {
        const nonExistentID = '771cca62-0f53-4fe6-9811-4fae380f75a7';
        const response = await chai.request(server)
          .patch(`/api/v1/articles/${slug}/comments/${nonExistentID}`)
          .set('Authorization', secondUserToken)
          .send('');
        expect(response.status).to.equal(404);
        expect(response.body.error)
          .to.equal('Comment does not exist');
      });

    it('should respond with 400 error if newComment field is not provided',
      async () => {
        const response = await chai.request(server)
          .patch(`/api/v1/articles/${slug}/comments/${secondCommentID}`)
          .set('Authorization', secondUserToken)
          .send();
        expect(response.status).to.equal(400);
        expect(response.body.error)
          .to.equal('comment params is missing, empty or invalid');
      });

    it('should respond with 401 error if comment was not created by user',
      async () => {
        const response = await chai.request(server)
          .patch(`/api/v1/articles/${slug}/comments/${secondCommentID}`)
          .set('Authorization', firstUserToken)
          .send({ newComment: firstComment });
        const errorMessage = 'You are not authorized to edit this comment';
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal(errorMessage);
      });

    it('should edit comment entry with valid parameters',
      async () => {
        const response = await chai.request(server)
          .patch(`/api/v1/articles/${slug}/comments/${secondCommentID}`)
          .set('Authorization', secondUserToken)
          .send({ newComment: thirdComment });
        expect(response.status).to.equal(200);
        expect(response.body.updatedComment).to.equal(thirdComment);
      });
  });

  describe('GET Comment', () => {
    it('should get comment',
      async () => {
        const response = await chai.request(server)
          .get(`/api/v1/articles/${slug}/comments/${secondCommentID}`)
          .set('Authorization', secondUserToken);
        expect(response.status).to.equal(200);
        expect(response.body.comment).to.equal(thirdComment);
      });

    it('should get comment edit history',
      async () => {
        const response = await chai.request(server)
          .get(`/api/v1/articles/${slug}/comments/${secondCommentID}/edits`)
          .set('Authorization', secondUserToken);
        expect(response.status).to.equal(200);
        expect(typeof (response.body.comment)).to.equal('object');
      });
  });

  describe('Delete Comment', () => {
    it('should not delete comment if not created by user',
      async () => {
        const response = await chai.request(server)
          .delete(`/api/v1/articles/${slug}/comments/${secondCommentID}`)
          .set('Authorization', firstUserToken);
        const errorMessage = 'You are not authorized to edit this comment';
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal(errorMessage);
      });

    it('should delete comment if created by user',
      async () => {
        const response = await chai.request(server)
          .delete(`/api/v1/articles/${slug}/comments/${secondCommentID}`)
          .set('Authorization', secondUserToken);
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Comment deleted successfully');
      });
  });
});
