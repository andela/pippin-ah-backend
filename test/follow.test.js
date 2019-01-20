import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

describe('FOLLOW TEST SUITE', () => {
  let firstUserToken;
  let secondUserToken;

  before(async () => {
    await models.sequelize.sync({ force: true });
    const firstUser = {
      username: 'johnsolomon',
      email: 'john@solomon.com',
      password: 'johnny777'
    };

    const secondUser = {
      username: 'marydoe',
      email: 'mary@doe.com',
      password: 'mary519m'
    };

    const firstUserResponse = await chai.request(server).post('/api/v1/users')
      .send(firstUser);
    firstUserToken = firstUserResponse.body.token;
    await chai.request(server).post('/api/v1/users')
      .send(firstUser);

    const secondUserResponse = await chai.request(server).post('/api/v1/users')
      .send(secondUser);
    secondUserToken = secondUserResponse.body.token;
  });

  describe('Follow Validations', () => {
    it('Should not be able to follow user when no token is provided',
      async () => {
        const response = await chai
          .request(server)
          .post('/api/v1/profiles/marydoe/follow');
        expect(response.body.error).to.equal('No token provided');
      });

    it('Should not be able to follow user with invalid token provided',
      async () => {
        const response = await chai
          .request(server)
          .post('/api/v1/profiles/marydoe/follow')
          .set('Authorization', 'someInvalidToken');
        expect(response.body.error).to.equal('Invalid token');
      });

    it('Should not be able to follow a non-existent user',
      async () => {
        const response = await chai
          .request(server)
          .post('/api/v1/profiles/johndoe/follow')
          .set('Authorization', firstUserToken);
        expect(response.body.error)
          .to.equal('The user provided does not exist');
      });

    it('Should not be able to follow self',
      async () => {
        const response = await chai
          .request(server)
          .post('/api/v1/profiles/johnsolomon/follow')
          .set('Authorization', firstUserToken);
        expect(response.body.error).to.equal('You cannot follow yourself');
      });

    it('Should be able to follow another user',
      async () => {
        const response = await chai
          .request(server)
          .post('/api/v1/profiles/marydoe/follow')
          .set('Authorization', firstUserToken);
        expect(response.body.message).to.equal('You are now following marydoe');
      });

    it('Should not be able to follow the same user twice',
      async () => {
        const response = await chai
          .request(server)
          .post('/api/v1/profiles/marydoe/follow')
          .set('Authorization', firstUserToken);
        expect(response.body.error)
          .to.equal('You are already following this user');
      });
  });

  describe('Followers', () => {
    it('Should not be able to get followers when no token is provided',
      async () => {
        const response = await chai
          .request(server)
          .post('/api/v1/profile/followers');
        expect(response.body.error).to.equal('No token provided');
      });

    it('Should not be able to get followers with invalid token provided',
      async () => {
        const response = await chai
          .request(server)
          .post('/api/v1/profile/followers')
          .set('Authorization', 'someInvalidToken');
        expect(response.body.error).to.equal('Invalid token');
      });

    it('Should be able to get followers with valid token',
      async () => {
        const response = await chai
          .request(server)
          .get('/api/v1/profile/followers')
          .set('Authorization', secondUserToken);
        expect(
          response.body.followers[0].followerDetails.username
        ).to.equal('johnsolomon');
      });
  });

  describe('Following', () => {
    it('Should not be able to get followed users when no token is provided',
      async () => {
        const response = await chai
          .request(server)
          .post('/api/v1/profile/following');
        expect(response.body.error).to.equal('No token provided');
      });

    it('Should not be able to get followed users with invalid token provided',
      async () => {
        const response = await chai
          .request(server)
          .post('/api/v1/profile/following')
          .set('Authorization', 'someInvalidToken');
        expect(response.body.error).to.equal('Invalid token');
      });

    it('Should be able to get followed users with valid token',
      async () => {
        const response = await chai
          .request(server)
          .get('/api/v1/profile/following')
          .set('Authorization', firstUserToken);
        expect(
          response.body.following[0].userDetails.username
        ).to.equal('marydoe');
      });
  });
});
