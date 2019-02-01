import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

describe('Test Suite for Highlights', () => {
  let accessToken, baseUrl, articleSlug;

  before(async () => {
    await models.sequelize.sync({ force: true });

    const userRequestObject = {
      username: 'bolasmith',
      email: 'bolasmith@email.com',
      password: 'balabola'
    };

    const articleRequestObject = {
      title: 'How I Won the Lottery',
      body: 'I could not have even dreamt of getting rich',
      description: 'What a wonderful way to describe an article!',
      category: 'Arts'
    };

    const responseObject = await chai.request(server)
      .post('/api/v1/users')
      .send(userRequestObject);
    accessToken = responseObject.body.token;

    const articleResponse = await chai.request(server)
      .post('/api/v1/articles')
      .send(articleRequestObject)
      .set('Authorization', accessToken);
    articleSlug = articleResponse.body.slug;
    baseUrl = `/api/v1/articles/${articleSlug}/highlights`;
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
        .post(`${baseUrl}`)
        .send()
        .set('Authorization', accessToken);
      const errorMsg = 'Required params are not supplied';
      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal(errorMsg);
    });

    it('should not highlight an article with invalid input Type', async () => {
      const response = await chai.request(server)
        .post(`${baseUrl}`)
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
  });
});
