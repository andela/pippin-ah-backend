import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

const { User } = models;
const baseUrl = '/api/v1/articles';

chai.use(chaiHttp);

describe.only('Test Suite for Rating', () => {
  let nonMentorToken;
  let isMentorToken;
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
    const loginRequestObject = {
      usernameOrEmail: 'bugsburney',
      password: 'bugsbugs'
    };

    const nonMentorResponseObject = await chai.request(server)
      .post('/api/v1/users')
      .send(userRequestObject);
    nonMentorToken = nonMentorResponseObject.body.token;

    await chai.request(server)
      .post(baseUrl)
      .send(articleRequestObject)
      .set('Authorization', nonMentorToken);

    const user = await User.findOne({ where: { username: 'bugsburney' } });
    await user.update({
      isMentor: true,
      password: 'bugsbugs'
    });

    const isMentorResponseObject = await chai.request(server)
      .post('/api/v1/users/login')
      .send(loginRequestObject);
    isMentorToken = isMentorResponseObject.body.token;
  });

  describe('Rate Article', () => {
    it('should not rate an article if user is not logged in',
      async () => {
        const response = await chai.request(server)
          .patch(`${baseUrl}/rating/silicon-valley-bugsburney`)
          .send({ rateValue: 5 });
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('No token provided');
      });

    it('should not rate an article if user is not a mentor',
      async () => {
        const response = await chai.request(server)
          .patch(`${baseUrl}/rating/silicon-valley-bugsburney`)
          .set('Authorization', nonMentorToken)
          .send({ rateValue: 5 });
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('Only mentors can rate articles');
      });

    it('should not rate an article if value is not a number',
      async () => {
        const response = await chai.request(server)
          .patch(`${baseUrl}/rating/silicon-valley-bugsburney`)
          .set('Authorization', isMentorToken)
          .send({ rateValue: 'a' });
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('Value must be a number');
      });

    it('should not rate an article if value is less than 1 or greater than 5',
      async () => {
        const response = await chai.request(server)
          .patch(`${baseUrl}/rating/silicon-valley-bugsburney`)
          .set('Authorization', isMentorToken)
          .send({ rateValue: '8' });
        const errorMessage = 'Value must not be less than 1 or greater than 5';
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal(errorMessage);
      });
  });
});
