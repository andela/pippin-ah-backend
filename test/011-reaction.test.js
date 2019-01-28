import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

const baseUrl = '/api/v1';

describe('REACTION TEST SUITE', () => {
  let token;
  let slug;
  let id;
  const fakeId = 'E7C7379B-904D-47DE-A958-80E7B3B2FE24';
  const comment = 'This Article is a poor excuse for an Article';
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

    const responseComment = await chai.request(server)
      .post(`/api/v1/articles/${slug}/comments/`)
      .set('Authorization', token)
      .send({ comment });
    ({ id } = responseComment.body);
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
          .patch(`${baseUrl}/articles/${slug}/cancelreaction`);
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('No token provided');
      });

    it('should not authorize canceling a reaction if invalid token is provided',
      async () => {
        const response = await chai.request(server)
          .patch(`${baseUrl}/articles/${slug}/cancelreaction`)
          .set('Authorization', 'invalid token');
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('Invalid token');
      });

    it('should succesfully cancel reaction on a valid article with right token',
      async () => {
        const response = await chai.request(server)
          .patch(`${baseUrl}/articles/${slug}/cancelreaction`)
          .set('Authorization', token);
        expect(response.status).to.equal(200);
      });
  });

  describe('Like a Comment', () => {
    it('should like a comment', async () => {
      const response = await chai.request(server)
        .post(`${baseUrl}/articles/${slug}/comments/${id}/like`)
        .set('Authorization', token);
      expect(response.status).to.equal(200);
    });

    it('should dislike a comment', async () => {
      const response = await chai.request(server)
        .patch(`${baseUrl}/articles/${slug}/comments/${id}/dislike`)
        .set('Authorization', token);
      expect(response.status).to.equal(200);
    });

    it('should not allow like action for a non-existent comment', async () => {
      const response = await chai.request(server)
        .post(`${baseUrl}/articles/${slug}/comments/${fakeId}/like`)
        .set('Authorization', token);
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal('Comment does not exist');
    });
  });
});
