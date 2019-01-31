import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

const { Request } = models;
const baseUrl = '/api/v1/user/request';
let firstUserToken;
let secondUserToken;
let adminToken;
let firstRequestId;
let secondRequestId;
let thirdRequestId;
const fakeId = 'BBECD162-0754-44CB-9974-5725E7EA7A94';

describe('REQUEST TEST SUITE', () => {
  before(async () => {
    await models.sequelize.sync({ force: true });
    const user = await chai.request(server).post('/api/v1/users')
      .send({
        username: 'johnsolomon',
        email: 'john@solomon.com',
        password: 'johnny777'
      });
    firstUserToken = user.body.token;

    const secondUser = await chai.request(server).post('/api/v1/users')
      .send({
        username: 'Sarahigbin',
        email: 'sarah@igbin.com',
        password: 'johnny222'
      });
    secondUserToken = secondUser.body.token;

    const adminSignup = await chai.request(server).post('/api/v1/users')
      .send({
        username: 'pennbagley',
        email: 'pennbagley@solomon.com',
        password: 'johnny28',
        isAdmin: true
      });
    adminToken = adminSignup.body.token;
  });

  describe('MENTORSHIP REQUEST', () => {
    it('Should not permit request to be a mentor when no token is provided',
      async () => {
        const response = await chai
          .request(server)
          .post(baseUrl);
        expect(response.body.error).to.equal('No token provided');
      });

    it('Should not permit request to be a mentor with invalid token provided',
      async () => {
        const response = await chai
          .request(server)
          .post(baseUrl)
          .set('Authorization', 'someInvalidToken');
        expect(response.body.error).to.equal('Invalid token');
      });

    it('Should successfully create request to be a mentor with valid token',
      async () => {
        const response = await chai
          .request(server)
          .post(baseUrl)
          .set('Authorization', firstUserToken);
        firstRequestId = response.body.id;
        expect(response.body.message)
          .to.equal('Your request to be a mentor has been sent');
      });

    it('Should not permit creating request when there is a pending one',
      async () => {
        const response = await chai
          .request(server)
          .post(baseUrl)
          .set('Authorization', firstUserToken);
        expect(response.status).to.equal(409);
        expect(response.body.error)
          .to.equal('You already requested to be a mentor');

        const currentRequest = await Request.findOne({
          where: { status: 'pending' }
        });
        currentRequest.status = 'approved';
        await currentRequest.save();
      });

    it('Should not permit request to be a mentor if already a mentor',
      async () => {
        const response = await chai
          .request(server)
          .post(baseUrl)
          .set('Authorization', firstUserToken);
        expect(response.status).to.equal(409);
        expect(response.body.error)
          .to.equal('You are already a mentor');
      });
  });

  describe('RESOLVE REQUEST', () => {
    it('Should not approve a request that does not exist', async () => {
      const response = await chai
        .request(server)
        .patch(`${baseUrl}/approve/${fakeId}`)
        .set('Authorization', firstUserToken);
      expect(response.body.error)
        .to.equal('Request not found');
    });

    it('should only permit request approvals for admin users', async () => {
      const response = await chai
        .request(server)
        .patch(`${baseUrl}/approve/${firstRequestId}`)
        .set('Authorization', firstUserToken);
      expect(response.body.error)
        .to.equal('Unauthorized');

      const createRequestResponse = await chai.request(server).post(baseUrl)
        .set('Authorization', adminToken);
      secondRequestId = createRequestResponse.body.id;
    });

    it('should allow admin approve valid requests', async () => {
      const response = await chai
        .request(server)
        .patch(`${baseUrl}/approve/${secondRequestId}`)
        .set('Authorization', adminToken);
      expect(response.status).to.equal(200);
    });

    it('should not resolve request if uuid is invalid',
      async () => {
        const response = await chai
          .request(server)
          .patch(`${baseUrl}/approve/5`)
          .set('Authorization', adminToken);
        expect(response.body.error).to.equal('Invalid uuid');
      });

    it('should not allow rejection of a nonexistent request', async () => {
      const response = await chai
        .request(server)
        .patch(`${baseUrl}/reject/${fakeId}`)
        .set('Authorization', firstUserToken);
      expect(response.body.error)
        .to.equal('Request not found');
    });

    it('should allow admin reject valid requests',
      async () => {
        const response = await chai
          .request(server)
          .patch(`${baseUrl}/reject/${firstRequestId}`)
          .set('Authorization', firstUserToken);
        expect(response.body.error)
          .to.equal('Unauthorized');

        const createRequestResponse2 = await chai.request(server).post(baseUrl)
          .set('Authorization', secondUserToken);
        thirdRequestId = createRequestResponse2.body.id;
      });

    it('should allow admin reject valid requests', async () => {
      const response = await chai
        .request(server)
        .patch(`${baseUrl}/reject/${thirdRequestId}`)
        .set('Authorization', adminToken);
      expect(response.status).to.equal(200);
    });

    it('should not allow rejection of an already rejected request',
      async () => {
        const response = await chai
          .request(server)
          .patch(`${baseUrl}/reject/${thirdRequestId}`)
          .set('Authorization', adminToken);
        expect(response.status).to.equal(409);
        expect(response.body.error).to.equal(
          'You request has already been rejected');
      });

    it('should not allow approval of an already approved request', async () => {
      const response = await chai
        .request(server)
        .patch(`${baseUrl}/approve/${firstRequestId}`)
        .set('Authorization', adminToken);
      expect(response.status).to.equal(409);
      expect(response.body.error).to.equal('You are already a mentor');
    });

    it('should not reject request if uuid is invalid', async () => {
      const response = await chai
        .request(server)
        .patch(`${baseUrl}/reject/5`)
        .set('Authorization', adminToken);
      expect(response.body.error).to.equal('Invalid uuid');
    });
  });
});
