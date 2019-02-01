import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

const { User } = models;
const baseUrl = '/api/v1/users';

describe('AUTHENTICATION TEST SUITE', () => {
  let userToken;
  before(async () => {
    await models.sequelize.sync({ force: true });

    const userRequestObject = {
      username: 'danmarriage',
      email: 'danmarriage@hotmail.com',
      password: 'danmarry'
    };

    const userResponseObject = await chai.request(server)
      .post('/api/v1/users')
      .send(userRequestObject);
    const { username } = userResponseObject.body;
    userToken = userResponseObject.body.token;

    const user = await User.findOne({ where: { username } });
    await user.destroy();
  });

  describe('JWT AUTHENTICATION', () => {
    it('should return a token on successful registration', async () => {
      const newUser2 = {
        username: 'joshbunny',
        email: 'joshbunny@gmail.com',
        password: 'joshbunnyspassword'
      };
      const response = await chai.request(server)
        .post(baseUrl)
        .send(newUser2);
      expect(response.body.token).to.not.equal(undefined);
    });

    it('should return a token on successful login', async () => {
      const newUser2 = {
        usernameOrEmail: 'joshbunny',
        password: 'joshbunnyspassword'
      };
      const response = await chai.request(server)
        .post(`${baseUrl}/login`)
        .send(newUser2);
      expect(response.body.token).to.not.equal(undefined);
    });

    it('should not allow access to protected routes if user does not exist',
      async () => {
        const articleObject = {
          title: 'Can A Butterfly Fly!',
          body: 'Butterfly Article Content',
          description: 'Article Description',
          category: 'Science'
        };
        const response = await chai.request(server)
          .post('/api/v1/articles')
          .set('Authorization', userToken)
          .send(articleObject);
        expect(response.body.error).to.equal('Invalid token');
      });
  });

  describe('SOCIAL AUTHENTICATION', () => {
    describe('Google Authentication Test', () => {
      it('should successfully register a user via google',
        async () => {
          const response = await chai.request(server)
            .get(`${baseUrl}/google`);
          expect(response.status).to.equal(201);
        });
      it('should successfully authenticate a returning user via google',
        async () => {
          const response = await chai.request(server)
            .get(`${baseUrl}/google`);
          expect(response.status).to.equal(200);
        });
    });

    describe('Twitter Authentication Test', () => {
      it('should successfully authenticate a user via twitter',
        async () => {
          const response = await chai.request(server)
            .get(`${baseUrl}/twitter`);
          expect(response.status).to.equal(200);
        });
    });
  });

  describe('Facebook Authentication Test', () => {
    it('should successfully authenticate a user via facebook',
      async () => {
        const response = await chai.request(server)
          .get(`${baseUrl}/facebook`);
        expect(response.status).to.equal(200);
      });
  });
});
