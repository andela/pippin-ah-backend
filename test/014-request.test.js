import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

const { Request } = models;
const baseUrl = '/api/v1/user/request';
let token;
let token2;
let id;
const fakeid = 'BBECD162-0754-44CB-9974-5725E7EA7A94';

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

    const adminSignup = await chai.request(server).post('/api/v1/users')
      .send({
        username: 'pennbagley',
        email: 'pennbagley@solomon.com',
        password: 'johnny28',
        isAdmin: true
      });
    token2 = adminSignup.body.token;
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
          .set('Authorization', token);
        ({ id } = response.body);
        expect(response.body.message)
          .to.equal('Your request to be a mentor has been sent');
      });

    it('Should not permit creating request when there is a pending one',
      async () => {
        const response = await chai
          .request(server)
          .post(baseUrl)
          .set('Authorization', token);
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
          .set('Authorization', token);
        expect(response.status).to.equal(409);
        expect(response.body.error)
          .to.equal('You are already a mentor');
      });
  });

  describe('RESOLVE REQUEST', () => {
    it('Should not allow resolve when request is not found',
      async () => {
        const response = await chai
          .request(server)
          .patch(`${baseUrl}/resolve/${fakeid}`)
          .set('Authorization', token);
        expect(response.body.error)
          .to.equal('Request not found');
      });

    it('Only an admin should be allowed to resolve request',
      async () => {
        const response = await chai
          .request(server)
          .patch(`${baseUrl}/resolve/${id}`)
          .set('Authorization', token);
        expect(response.body.error)
          .to.equal('Unauthorized');
      });

    it('if request is found Admin should be able to resolve request',
      async () => {
        const response = await chai
          .request(server)
          .patch(`${baseUrl}/resolve/${id}`)
          .set('Authorization', token2);
        expect(response.status).to.equal(200);
      });
  });
});
