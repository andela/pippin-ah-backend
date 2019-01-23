import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

const baseUrl = '/api/v1';

describe('REACTION TEST SUITE', () => {
  let token;
  let slug;

  before(async () => {
    await models.sequelize.sync({ force: true });

    const userRequestObject = {
      username: 'newusername',
      email: 'newaddress@email.com',
      password: 'newpassword'
    };

    const articleObject = {
      title: 'A Man in the Moon',
      body: 'Going to the moon is tricky',
      description: 'Importance of the moon',
      category: 'Science'
    };

    const responseObject = await chai.request(server).post(`${baseUrl}/users`)
      .send(userRequestObject);
    ({ token } = responseObject.body);

    const article = await chai.request(server)
      .post(`${baseUrl}/articles`)
      .send(articleObject)
      .set('Authorization', token);
    ({ slug } = article.body);
  });

  describe('Like an Article', () => {
    it('should not authorize like action if no token is provided',
      async () => {
        const response = await chai.request(server)
          .patch(`${baseUrl}/articles/${slug}/like`);
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('No token provided');
      });

    it('should not authorize like action if invalid token is provided',
      async () => {
        const response = await chai.request(server)
          .patch(`${baseUrl}/articles/${slug}/like`)
          .set('Authorization', 'invalid token');
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('Invalid token');
      });

    it('should not allow like action for a non-existent article',
      async () => {
        const response = await chai.request(server)
          .patch(`${baseUrl}/articles/fakeSlug/like`)
          .set('Authorization', token);
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('Article provided does not exist');
      });

    it('should succesfully like a valid article with right token',
      async () => {
        const response = await chai.request(server)
          .patch(`${baseUrl}/articles/${slug}/like`)
          .set('Authorization', token);
        expect(response.status).to.equal(200);
      });
  });

  describe('Dislike an Article', () => {
    it('should not authorize dislike action if no token is provided',
      async () => {
        const response = await chai.request(server)
          .patch(`${baseUrl}/articles/${slug}/dislike`);
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('No token provided');
      });

    it('should not authorize dislike action if invalid token is provided',
      async () => {
        const response = await chai.request(server)
          .patch(`${baseUrl}/articles/${slug}/dislike`)
          .set('Authorization', 'invalid token');
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('Invalid token');
      });

    it('should succesfully dislike a valid article with right token',
      async () => {
        const response = await chai.request(server)
          .patch(`${baseUrl}/articles/${slug}/dislike`)
          .set('Authorization', token);
        expect(response.status).to.equal(200);
      });
  });

  describe('Cancel Reaction on an Article', () => {
    it('should not authorize cancelling a reaction if no token is provided',
      async () => {
        const response = await chai.request(server)
          .patch(`${baseUrl}/articles/${slug}/cancel-reaction`);
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('No token provided');
      });

    it('should not authorize canceling a reaction if invalid token is provided',
      async () => {
        const response = await chai.request(server)
          .patch(`${baseUrl}/articles/${slug}/cancel-reaction`)
          .set('Authorization', 'invalid token');
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('Invalid token');
      });

    it('should succesfully cancel reaction on a valid article with right token',
      async () => {
        const response = await chai.request(server)
          .patch(`${baseUrl}/articles/${slug}/cancel-reaction`)
          .set('Authorization', token);
        expect(response.status).to.equal(200);
      });
  });
});


// it('should respond with 400 error if comment field is not provided',
//   async () => {
//     const response = await chai.request(server)
//       .post(`/api/v1/articles/${slug}/comments`)
//       .set('Authorization', accesstoken);
//     expect(response.status).to.equal(400);
//     expect(response.body.error)
//       .to.equal('comment params is missing, empty or invalid');
//   });

// it('should respond with 400 error if the comment supplied is not a string',
//   async () => {
//     const response = await chai.request(server)
//       .post(`/api/v1/articles/${slug}/comments`)
//       .set('Authorization', accesstoken)
//       .send([]);
//     expect(response.status).to.equal(400);
//     expect(response.body.error)
//       .to.equal('comment params is missing, empty or invalid');
//   });

// it('should not allow comment entries greater than 1000 characters',
//   async () => {
//     const response = await chai.request(server)
//       .post(`/api/v1/articles/${slug}/comments`)
//       .set('Authorization', accesstoken)
//       .send({
//         comment: 'x'.repeat(1001)
//       });
//     expect(response.status).to.equal(400);
//     expect(response.body.error)
//       .to.equal('comment is greater than 1000 characters');
//   });

// it('should not permit comment entry for non-existent articles',
//   async () => {
//     const response = await chai.request(server)
//       .post('/api/v1/articles/noArticle/comments')
//       .set('Authorization', accesstoken)
//       .send({ comment });
//     expect(response.status).to.equal(404);
//     expect(response.body.error)
//       .to.equal('Article provided does not exist');
//   });

// it('should add comment entry with valid parameters',
//   async () => {
//     const response = await chai.request(server)
//       .post(`/api/v1/articles/${slug}/comments`)
//       .set('Authorization', accesstoken)
//       .send({ comment });
//     expect(response.status).to.equal(200);
//     expect(response.body.comment)
//       .to.equal(comment);
//   });
