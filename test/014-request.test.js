import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

const { Request } = models;
const baseUrl = '/api/v1/user/request';
let token;

describe('REQUEST TEST SUITE', () => {
  before(async () => {
    await models.sequelize.sync({ force: true });
    const user = await chai.request(server).post('/api/v1/users')
      .send({
        username: 'johnsolomon',
        email: 'john@solomon.com',
        password: 'johnny777'
      });
    ({ token } = user.body);
  });

  describe('MENTORSHIP REQUEST', () => {
    it('Should not permit mentorship request  when no token is provided',
      async () => {
        const response = await chai
          .request(server)
          .post(baseUrl);
        expect(response.body.error).to.equal('No token provided');
      });

    it('Should not permit mentorship request with invalid token provided',
      async () => {
        const response = await chai
          .request(server)
          .post(baseUrl)
          .set('Authorization', 'someInvalidToken');
        expect(response.body.error).to.equal('Invalid token');
      });

    it('Should successfully create a mentorship request with valid token',
      async () => {
        const response = await chai
          .request(server)
          .post(baseUrl)
          .set('Authorization', token);
        expect(response.body.message)
          .to.equal('Your mentorship request has been sent');
      });

    it('Should not permit creating request when there is a pending one',
      async () => {
        const response = await chai
          .request(server)
          .post(baseUrl)
          .set('Authorization', token);
        expect(response.status).to.equal(409);
        expect(response.body.error)
          .to.equal('You already requested for mentorship');

        const currentRequest = await Request.findOne({
          where: { status: 'pending' }
        });
        currentRequest.status = 'approved';
        await currentRequest.save();
      });

    it('Should not permit mentorship request by a mentor',
      async () => {
        const response = await chai
          .request(server)
          .post(baseUrl)
          .set('Authorization', token);
        expect(response.status).to.equal(409);
        expect(response.body.error)
          .to.equal('You are already a mentor');
      });
  });
});
