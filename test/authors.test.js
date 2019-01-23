import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

const baseUrl = '/api/v1';

describe('AUTHOR TEST SUITE', async () => {
  let accessToken;

  before(async () => {
    models.sequelize.sync({ force: true });

    const userRequestObject = {
      username: 'JohnDoe',
      email: 'john@doe.com',
      password: 'john26354'
    };

    const articleRequestObject = {
      title: 'The new boston',
      body: 'Bucky rubert is the only person you hear in the newboston',
      description: 'Article Description for get all authors',
      category: 'Arts'
    };

    const responseObject = await chai.request(server).post(`${baseUrl}/users`)
      .send(userRequestObject);
    accessToken = responseObject.body.token;

    await chai.request(server)
      .post(`${baseUrl}/articles`)
      .send(articleRequestObject)
      .set('Authorization', accessToken);
  });

  describe('GET ALL AUTHORS', () => {
    it('Should successfully get a list of all authors', (done) => {
      chai
        .request(server)
        .get(`${baseUrl}/user/authors`)
        .set('Authorization', accessToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body[0].author).to.equal('JohnDoe');
          expect(Array.isArray(res.body)).to.equal(true);
          expect(res.body[0].firstName).to.equal(null);
          done();
        });
    });
  });
});
