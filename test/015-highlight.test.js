import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

let accessToken,
  secondUserAccessToken,
  url,
  articleSlug,
  highlightId;

describe('Test Suite for Highlights', () => {
  before(async () => {
    await models.sequelize.sync({ force: true });

    const firstUserRequestObject = {
      username: 'bolasmith',
      email: 'bolasmith@email.com',
      password: 'balabola'
    };

    const secondUserRequestObject = {
      username: 'toluwole',
      email: 'toluwole@email.com',
      password: 'toluwole'
    };

    const articleRequestObject = {
      title: 'How I Won the Lottery',
      body: 'I could not have even dreamt of getting rich',
      description: 'What a wonderful way to describe an article!',
      category: 'Arts'
    };

    const firstHighlightObject = {
      highlightedText: 'it was at that moment I knew who he was',
      startIndex: '72',
      stopIndex: '105',
      comment: 'I love how it was well put'
    };

    const firstUserResponseObject = await chai.request(server)
      .post('/api/v1/users')
      .send(firstUserRequestObject);
    accessToken = firstUserResponseObject.body.token;

    const secondUserResponseObject = await chai.request(server)
      .post('/api/v1/users')
      .send(secondUserRequestObject);
    secondUserAccessToken = secondUserResponseObject.body.token;

    const articleResponse = await chai.request(server)
      .post('/api/v1/articles')
      .send(articleRequestObject)
      .set('Authorization', accessToken);
    articleSlug = articleResponse.body.slug;
    url = `/api/v1/articles/${articleSlug}/highlights`;

    const highlightResponse = await chai.request(server)
      .post(`${url}`)
      .set('Authorization', accessToken)
      .send(firstHighlightObject);
    highlightId = highlightResponse.body.id;
  });

  describe('Highlight Text', () => {
    it('Should not highlight an article when the slug does not exist',
      async () => {
        const response = await chai.request(server)
          .post('/api/v1/articles/non-existent-slug/highlights')
          .set('Authorization', accessToken);
        expect(response.status).to.equal(404);
        expect(response.body).to.have.deep.property('error');
        expect(response.body.error).to.equal('Article provided does not exist');
      });

    it('should not highlight an article without valid inputs', async () => {
      const response = await chai.request(server)
        .post(`${url}`)
        .send()
        .set('Authorization', accessToken);
      const errorMsg = 'Required params are not supplied';
      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal(errorMsg);
    });

    it('should not highlight an article with invalid input Type', async () => {
      const response = await chai.request(server)
        .post(`${url}`)
        .send({
          highlightedText: 'Something to think about',
          startIndex: 'startIndex',
          stopIndex: 'stopIndex',
          comment: 'This pushed me to the edge.'
        })
        .set('Authorization', accessToken);
      const errorMsg = '[startIndex] and [stopIndex] have to be numeric!';
      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal(errorMsg);
    });

    it('should highlight an article with valid inputs', async () => {
      const highlightObject = {
        highlightedText: 'Something to think about',
        startIndex: '2',
        stopIndex: '58',
        comment: 'This pushed me to the edge.'
      };
      const response = await chai.request(server)
        .post(`${url}`)
        .set('Authorization', accessToken)
        .send(highlightObject);
      expect(response.status).to.equal(201);
      expect(response.body.stopIndex).to.equal(58);
    });

    it('should not return an empty array if user has no highlight',
      async () => {
        const response = await chai.request(server)
          .get(`${url}`)
          .set('Authorization', secondUserAccessToken);
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('You have no highlights yet!');
      });

    it('should get all user\'s highlights in an article', async () => {
      const response = await chai.request(server)
        .get(`${url}`)
        .set('Authorization', accessToken);
      expect(response.status).to.equal(200);
      expect(typeof (response.body.highlights)).to.equal('object');
    });
  });

  describe('Remove Highlight', () => {
    it('should return an error if highlight does not exist',
      async () => {
        const nonExistingId = '5dc8272e-6296-4048-a51c-2ef5f61e4ee6';
        const response = await chai.request(server)
          .delete(`${url}/${nonExistingId}`)
          .set('Authorization', accessToken);
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('Highlight does not exist');
      });

    it('should not remove a highlight if not owned by user',
      async () => {
        const response = await chai.request(server)
          .delete(`${url}/${highlightId}`)
          .set('Authorization', secondUserAccessToken);
        const errorMessage = 'You are not authorized to delete this highlight!';
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal(errorMessage);
      });

    it('should successfully remove highlight',
      async () => {
        const response = await chai.request(server)
          .delete(`${url}/${highlightId}`)
          .set('Authorization', accessToken);
        const message = 'Highlight removed successfully!';
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal(message);
      });
  });
});
