import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

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
        .post('/api/v1/users')
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
        .post('/api/v1/users/login')
        .send(newUser2)
        .end((err, res) => {
          expect(res.body.token).to.not.equal(undefined);
          done();
        });
    });
  });

  describe('GOOGLE AUTHENTICATION', () => {
    it('should redirect to google login page', async () => {
      const response = await chai.request(server).get('/api/v1/users/google');
      const redirectUrlSubstring = 'https://accounts.google.com/o/oauth2';
      const redirectUrl = response.redirects[0];
      expect(200);
      expect(redirectUrl.includes(redirectUrlSubstring)).to.equal(true);
    });
  });

  describe('FACE AUTHENTICATION', () => {
    it('should redirect to facebook login page', async () => {
      const response = await chai.request(server).get('/api/v1/users/facebook');
      const redirectUrlSubstring = 'https://www.facebook.com/dialog/oauth';
      const redirectUrl = response.redirects[0];
      expect(200);
      expect(redirectUrl.includes(redirectUrlSubstring)).to.equal(true);
    });
  });
});
