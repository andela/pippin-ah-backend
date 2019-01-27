import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

const baseUrl = '/api/v1/users';

describe('AUTHENTICATION TEST SUITE', () => {
  before(() => models.sequelize.sync({ force: true }));

  describe('JWT AUTHENTICATION', () => {
    it('should return a token on successful registration', (done) => {
      const newUser2 = {
        username: 'ebenezer',
        email: 'ebenezer@gmail.com',
        password: 'secretstuff'
      };
      chai
        .request(server)
        .post(baseUrl)
        .send(newUser2)
        .end((err, res) => {
          expect(res.body.token).to.not.equal(undefined);
          done();
        });
    });
    it('should return a token on successful login', (done) => {
      const newUser2 = {
        usernameOrEmail: 'ebenezer',
        password: 'secretstuff'
      };
      chai
        .request(server)
        .post(`${baseUrl}/login`)
        .send(newUser2)
        .end((err, res) => {
          expect(res.body.token).to.not.equal(undefined);
          done();
        });
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
