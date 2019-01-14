import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';

import 'babel-polyfill';
import server from '../app';

chai.use(chaiHttp);

describe('AUTHENTICATION TEST SUITE', () => {
  before(() => models.sequelize.sync({ force: true }));

  describe('JWT AUTHENTICATION', () => {
    it('should return a token on successful registration',
      (done) => {
        const newUser2 = {
          username: 'habibaudu',
          email: 'auduhabib1990@gmail.com',
          password: 'hhrt----',
        };
        chai.request(server)
          .post('/api/v1/users')
          .send(newUser2)
          .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body.token).to.not.equal(undefined);
            done();
          });
      });
    it('should return a token on successful login',
      (done) => {
        const newUser2 = {
          username: 'habibaudu',
          email: 'auduhabib1990@gmail.com',
          password: 'hhrt----',
        };
        chai.request(server)
          .post('/api/v1/users/login')
          .send(newUser2)
          .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body.token).to.not.equal(undefined);
            done();
          });
      });
  });
});
