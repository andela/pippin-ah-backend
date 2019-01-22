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
    it('Should not permit following a user when no token is provided',
      async () => {
        const response = await chai
          .request(server)
          .post('/api/v1/profiles/marydoe/follow');
        expect(response.body.error).to.equal('No token provided');
      });

    it('Should not permit following a user with invalid token provided',
      async () => {
        const response = await chai
          .request(server)
          .post('/api/v1/profiles/marydoe/follow')
          .set('Authorization', 'someInvalidToken');
        expect(response.body.error).to.equal('Invalid token');
      });

    it('Should not permit following a non-existent user',
      async () => {
        const response = await chai
          .request(server)
          .post('/api/v1/profiles/johndoe/follow')
          .set('Authorization', firstUserToken);
        expect(response.body.error)
          .to.equal('The user provided does not exist');
      });

    it('Should not permit following self',
      async () => {
        const response = await chai
          .request(server)
          .post('/api/v1/profiles/johnsolomon/follow')
          .set('Authorization', firstUserToken);
        expect(response.body.error).to.equal('You cannot follow yourself');
      });

    it('Should permit following another user with valid parameters',
      async () => {
        const response = await chai
          .request(server)
          .post('/api/v1/profiles/marydoe/follow')
          .set('Authorization', firstUserToken);
        expect(response.body.message).to.equal('You are now following marydoe');
      });

    it('Should not permit following a user twice',
      async () => {
        const response = await chai
          .request(server)
          .post('/api/v1/profiles/marydoe/follow')
          .set('Authorization', firstUserToken);
        expect(response.body.error)
          .to.equal('You are already following this user');
      });
  });

  describe('GET A USER\'S FOLLOWERS LIST: /api/v1/profile/followers', () => {
    it('Should not permit getting followers when no token is provided',
      async () => {
        const response = await chai
          .request(server)
          .get('/api/v1/profile/followers');
        expect(response.body.error).to.equal('No token provided');
      });

    it('Should not permit getting followers with invalid token provided',
      async () => {
        const response = await chai
          .request(server)
          .get('/api/v1/profile/followers')
          .set('Authorization', 'someInvalidToken');
        expect(response.body.error).to.equal('Invalid token');
      });

    it('Should get followers list with valid token provided',
      async () => {
        const response = await chai
          .request(server)
          .get('/api/v1/profile/followers')
          .set('Authorization', secondUserToken);
        expect(
          response.body.followers[0].username
        ).to.equal('johnsolomon');
      });
  });

  describe('GET A USER\'S FOLLOWING LIST: /api/v1/profile/following', () => {
    it('Should not authorize following list request with no token provided',
      async () => {
        const response = await chai
          .request(server)
          .get('/api/v1/profile/following');
        expect(response.body.error).to.equal('No token provided');
      });

    it('Should not permit follower\'s list request with invalid token provided',
      async () => {
        const response = await chai
          .request(server)
          .get('/api/v1/profile/following')
          .set('Authorization', 'someInvalidToken');
        expect(response.body.error).to.equal('Invalid token');
      });

    it('Should get the following list with valid token provided',
      async () => {
        const response = await chai
          .request(server)
          .get('/api/v1/profile/following')
          .set('Authorization', firstUserToken);
        expect(
          response.body.following[0].username
        ).to.equal('marydoe');
      });
  });
});
