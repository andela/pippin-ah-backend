import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

const baseUrl = '/api/v1/articles';

describe('Test Suite for Rating', () => {
  let accesstoken;
  before(async () => {
    await models.sequelize.sync({ force: true });

    const userRequestObject = {
      username: 'bugsburney',
      email: 'bugsburney@email.com',
      password: 'bugsbugs'
    };
    const articleRequestObject = {
      title: 'Silicon Valley',
      body: 'Article Body',
      description: 'Article Description',
      category: 'Science'
    };

    const responseObject = await chai.request(server).post('/api/v1/users')
      .send(userRequestObject);
    accesstoken = responseObject.body.token;

    await chai.request(server)
      .post(baseUrl)
      .send(articleRequestObject)
      .set('Authorization', accesstoken);
  });

  describe('Rate Article', () => {
    it('should not rate an article if user is not logged in',
      async () => {
        const response = await chai.request(server)
          .post(`${baseUrl}/rating/silicon-valley-bugsburney`)
          .send({ rateValue: 5 });
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('No token provided');
      });

    it('should not rate an article if value is not a number',
      async () => {
        const response = await chai.request(server)
          .post(`${baseUrl}/rating/silicon-valley-bugsburney`)
          .set('Authorization', accesstoken)
          .send({ rateValue: 'a' });
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('Value must be a number');
      });

    it('should not rate an article if value is less than 1 or greater than 5',
      async () => {
        const response = await chai.request(server)
          .post(`${baseUrl}/rating/silicon-valley-bugsburney`)
          .set('Authorization', accesstoken)
          .send({ rateValue: 8 });
        const errorMessage = 'Value must not be less than 1 or greater than 5';
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal(errorMessage);
      });
  });
});
