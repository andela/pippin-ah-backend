import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

const { User } = models;
const baseUrl = '/api/v1/articles';

chai.use(chaiHttp);

describe('Test Suite for Rating', () => {
  let nonMentorToken;
  let isMentorToken;
  let secondUserToken;
  before(async () => {
    await models.sequelize.sync({ force: true });

    const firstUserRequestObject = {
      username: 'bugsburney',
      email: 'bugsburney@email.com',
      password: 'bugsbugs'
    };
    const secondUserRequestObject = {
      username: 'daffyduck',
      email: 'daffyduck@email.com',
      password: 'daffydaffy'
    };
    const firstArticleRequestObject = {
      title: 'Silicon Valley',
      body: 'Article Body',
      description: 'Article Description',
      category: 'Science'
    };
    const secondArticleRequestObject = {
      title: 'Tales of Two Strangers',
      body: 'Article Body',
      description: 'Article Description',
      category: 'Science'
    };
    const firstLoginRequestObject = {
      usernameOrEmail: 'bugsburney',
      password: 'bugsbugs'
    };
    const secondLoginRequestObject = {
      usernameOrEmail: 'daffyduck',
      password: 'daffydaffy'
    };

    const nonMentorResponseObject = await chai.request(server)
      .post('/api/v1/users')
      .send(firstUserRequestObject);
    nonMentorToken = nonMentorResponseObject.body.token;

    await chai.request(server)
      .post('/api/v1/users')
      .send(secondUserRequestObject);

    await chai.request(server)
      .post(baseUrl)
      .send(firstArticleRequestObject)
      .set('Authorization', nonMentorToken);

    const firstUser = await User.findOne({ where: { username: 'bugsburney' } });
    await firstUser.update({
      isMentor: true,
      password: 'bugsbugs'
    });

    const secondUser = await User.findOne({ where: { username: 'daffyduck' } });
    await secondUser.update({
      isMentor: true,
      password: 'daffydaffy'
    });

    const isMentorResponseObject = await chai.request(server)
      .post('/api/v1/users/login')
      .send(firstLoginRequestObject);
    isMentorToken = isMentorResponseObject.body.token;

    const secondUserResponseObject = await chai.request(server)
      .post('/api/v1/users/login')
      .send(secondLoginRequestObject);
    secondUserToken = secondUserResponseObject.body.token;

    await chai.request(server)
      .post(baseUrl)
      .send(secondArticleRequestObject)
      .set('Authorization', secondUserToken);

    await chai.request(server)
      .patch(`${baseUrl}/rating/tales-of-two-strangers-daffyduck`)
      .set('Authorization', secondUserToken)
      .send({ rateValue: '2' });
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

    it('should not rate an article if no value is provided',
      async () => {
        const response = await chai.request(server)
          .patch(`${baseUrl}/rating/silicon-valley-bugsburney`)
          .set('Authorization', isMentorToken)
          .send({ rateValue: '' });
        const errorMessage = 'Rate value must be provided';
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal(errorMessage);
      });

    it('should rate an article if value is valid and user is a mentor',
      async () => {
        const response = await chai.request(server)
          .patch(`${baseUrl}/rating/silicon-valley-bugsburney`)
          .set('Authorization', isMentorToken)
          .send({ rateValue: '4' });
        expect(response.status).to.equal(200);
        expect(response.body.yourRating).to.equal('4');
      });

    it('should rate an article even if it already has a rating',
      async () => {
        const response = await chai.request(server)
          .patch(`${baseUrl}/rating/tales-of-two-strangers-daffyduck`)
          .set('Authorization', isMentorToken)
          .send({ rateValue: '4' });
        expect(response.status).to.equal(200);
        expect(response.body.yourRating).to.equal('4');
      });
  });
});
