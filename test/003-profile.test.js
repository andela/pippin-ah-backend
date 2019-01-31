import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

const baseUrl = '/api/v1/profile';
const articleUrl = '/api/v1/articles';
let article1Response;
let article2Response;

describe.only('PROFILE TEST SUITE', () => {
  let user1Token, user2Token;
  before(async () => {
    await models.sequelize.sync({ force: true });

    const requestObject = {
      username: 'johnsolomon',
      email: 'john@solomon.com',
      password: 'johnny777'
    };

    const requestObject2 = {
      username: 'johndoe',
      email: 'johndoe@gmail.com',
      password: 'johndoe666'
    };

    const responseObject = await chai.request(server).post('/api/v1/users')
      .send(requestObject);
    user1Token = responseObject.body.token;


    const responseObject2 = await chai.request(server).post('/api/v1/users')
      .send(requestObject2);
    user2Token = responseObject2.body.token;

    const dummyArticles = [
      {
        title: 'My best Day1',
        body: 'This is the longest article on learnGround',
        description: 'Experience Recap',
        category: 'Arts'
      },
      {
        title: 'My best Day2',
        body: 'It was a great moment',
        description: 'Experience Recap',
        category: 'Arts'
      },
      {
        title: 'My best Day3',
        body: 'It was a great moment',
        description: 'Experience Recap',
        category: 'Arts'
      }
    ];

    article1Response = await chai.request(server)
      .post(articleUrl)
      .send(dummyArticles[0])
      .set('Authorization', user1Token);

    article2Response = await chai.request(server)
      .post(articleUrl)
      .send(dummyArticles[1])
      .set('Authorization', user1Token);

    await chai.request(server)
      .post(articleUrl)
      .send(dummyArticles[2])
      .set('Authorization', user1Token);

    await chai.request(server)
      .patch(`${articleUrl}/${article1Response.body.slug}/like`)
      .set('Authorization', user1Token);

    await chai.request(server)
      .patch(`${articleUrl}/${article2Response.body.slug}/like`)
      .set('Authorization', user1Token);

    await chai.request(server)
      .patch(`${articleUrl}/${article2Response.body.slug}/like`)
      .set('Authorization', user2Token);
  });


  describe('Profile Update', () => {
    it('Should update profile when valid inputs are supplied',
      async () => {
        const newProfile = {
          interests: ['Science', 'Technology'],
          firstName: 'Moses',
          lastName: 'Ezen',
          bio: 'sofware developer at google'
        };

        const response = await chai.request(server)
          .patch(baseUrl)
          .set('Authorization', user1Token)
          .send(newProfile);
        expect(response.body.interests[0]).to.equal('Science');
        expect(response.body.firstName).to.equal('Moses');
        expect(response.body.lastName).to.equal('Ezen');
        expect(response.body.bio).to.equal('sofware developer at google');
        expect(response.body.message).to.equal(
          'Profile updated successfully');
      });

    it('Should update profile when few valid inputs are supplied',
      async () => {
        const newProfile = {
          imageUrl: true
        };
        const response = await chai.request(server)
          .patch(baseUrl)
          .set('Authorization', user1Token)
          .send(newProfile);
        expect(response.body.message).to.equal(
          'Profile updated successfully');
      });


    it('Should not update if the first name is not all letters',
      async () => {
        const newProfile = {
          firstName: '6789032%^&*',
          lastName: 'Ezen',
          bio: 'sofware developer at google'
        };
        const response = await chai.request(server)
          .patch(baseUrl)
          .set('Authorization', user2Token)
          .send(newProfile);
        const errorResult = JSON.parse(response.body.error);
        expect(response.status).to.equal(400);
        expect(errorResult[0])
          .to.equal(
            'firstName must be alphabet');
      });


    it('Should not update if the last name is not all letters',
      async () => {
        const newProfile = {
          firstName: 'james',
          lastName: '8990&**^',
          bio: 'sofware developer at google'
        };
        const response = await chai.request(server)
          .patch(baseUrl)
          .set('Authorization', user2Token)
          .send(newProfile);
        const errorResult = JSON.parse(response.body.error);
        expect(response.status).to.equal(400);
        expect(errorResult[0])
          .to.equal(
            'lastName must be alphabet');
      });


    it('Should not update profile if the lastname is less than 2 characters',
      async () => {
        const newProfile = {
          firstName: 'james',
          lastName: 'S',
          bio: 'sofware developer at google'
        };
        const response = await chai.request(server)
          .patch(baseUrl)
          .set('Authorization', user2Token)
          .send(newProfile);
        const errorResult = JSON.parse(response.body.error);
        expect(response.status).to.equal(400);
        expect(errorResult[0])
          .to.equal(
            'lastName must be at least 2 characters long');
      });

    it('Should not update profile If the firstname is less than 2 characters',
      async () => {
        const newProfile = {
          firstName: 'j',
          lastName: 'Samuel',
          bio: 'sofware developer at google'
        };
        const response = await chai.request(server)
          .patch(baseUrl)
          .set('Authorization', user2Token)
          .send(newProfile);
        const errorResult = JSON.parse(response.body.error);
        expect(response.status).to.equal(400);
        expect(errorResult[0])
          .to.equal(
            'firstName must be at least 2 characters long');
      });


    it('Should not update profile if an invalid interest is supplied',
      async () => {
        const newProfile = {
          interests: ['Programing'],
          firstName: 'james',
          lastName: 'Sadiq',
          bio: 'sofware developer at google'
        };

        const expectedErrorArray = JSON.stringify(newProfile.interests);

        const response = await chai.request(server)
          .patch(baseUrl)
          .set('Authorization', user2Token)
          .send(newProfile);
        expect(response.status).to.equal(400);
        expect(response.body.error)
          // eslint-disable-next-line max-len
          .to.equal(`Invalid category ${expectedErrorArray}. Allowed categories are ["Science","Technology","Engineering","Arts","Mathematics"]`);
      });
  });

  it('Should not allow update for invalid interests', async () => {
    const newProfile = {
      interests: ['Programing', 'Travel'],
      firstName: 'james',
      lastName: 'Sadiq',
      bio: 'sofware developer at google'
    };

    const expectedErrorArray = JSON.stringify(newProfile.interests);

    const response = await chai.request(server)
      .patch(baseUrl)
      .set('Authorization', user2Token)
      .send(newProfile);
    expect(response.status).to.equal(400);
    expect(response.body.error)
      // eslint-disable-next-line max-len
      .to.equal(`Invalid categories ${expectedErrorArray}. Allowed categories are ["Science","Technology","Engineering","Arts","Mathematics"]`);
  });

  describe('USER STATS', () => {
    it('Should get all the articles a user has created',
      async () => {
        const response = await chai.request(server)
          .get(`${baseUrl}/stats`)
          .set('Authorization', user1Token);
        expect(response.body.authored.count).to.equal(3);
      });

    it('Should get all the articles a user has liked',
      async () => {
        const response = await chai.request(server)
          .get(`${baseUrl}/stats`)
          .set('Authorization', user1Token);
        expect(response.body.liked.count).to.equal(2);
      });

    it('Should get the most liked article as the top article',
      async () => {
        const response = await chai.request(server)
          .get(`${baseUrl}/stats`)
          .set('Authorization', user1Token);
        expect(response.body.top.articles[0].slug)
          .to.equal(article2Response.body.slug);
        await chai.request(server)
          .patch(`${articleUrl}/${article1Response.body.slug}/cancelreaction`)
          .set('Authorization', user1Token);

        await chai.request(server)
          .patch(`${articleUrl}/${article2Response.body.slug}/cancelreaction`)
          .set('Authorization', user1Token);

        await chai.request(server)
          .patch(`${articleUrl}/${article2Response.body.slug}/cancelreaction`)
          .set('Authorization', user2Token);
      });
    // eslint-disable-next-line max-len
    it('Should get the lengthiest article as top article when there are no liked articles',
      async () => {
        const response = await chai.request(server)
          .get(`${baseUrl}/stats`)
          .set('Authorization', user1Token);
        expect(response.body.top.articles[0].slug)
          .to.equal(article1Response.body.slug);
      });
  });
});
