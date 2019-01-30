import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

const { Notification } = models;
const baseUrl = '/api/v1';

describe('NOTIFIER TEST SUITE', () => {
  let accessToken, slug, notificationId, secondAccessToken;
  const comment = 'What a lovely way to put it!';

  before(async () => {
    await models.sequelize.sync({ force: true });

    const userRequestObject = {
      username: 'JohnDoe',
      email: 'john@doe.com',
      password: 'john26354'
    };

    const secondUserRequestObject = {
      username: 'Redneck',
      email: 'red@neck.com',
      password: 'redneck26354'
    };

    const articleRequestObject = {
      title: 'The new boston',
      body: 'Bucky rubert is the only person you hear in the newboston',
      description: 'Article Description for get all authors',
      category: 'Arts'
    };

    const responseObject = await chai.request(server)
      .post(`${baseUrl}/users`)
      .send(userRequestObject);
    accessToken = responseObject.body.token;

    const responseObjectTwo = await chai.request(server)
      .post(`${baseUrl}/users`)
      .send(secondUserRequestObject);
    secondAccessToken = responseObjectTwo.body.token;

    await chai.request(server)
      .post(`${baseUrl}/profile/JohnDoe/follow`)
      .set('Authorization', secondAccessToken);

    const articleResponse = await chai.request(server)
      .post(`${baseUrl}/articles/`)
      .send(articleRequestObject)
      .set('Authorization', accessToken);
    ({ slug } = articleResponse.body);
  });

  describe('NOTIFICATION TEST SUIT', () => {
    it('Should create record in NOTIFICATION table',
      async () => {
        const response = await chai.request(server)
          .post(`/api/v1/articles/${slug}/comments`)
          .set('Authorization', secondAccessToken)
          .send({ comment });
        expect(response.status).to.equal(200);
        const body = 'Redneck just commented on your article: The new boston';
        const notificationResponse = await Notification.findOne({
          where: { body }
        });
        notificationId = notificationResponse.id;
      }
    );

    it('Should get all notification that has not been read',
      async () => {
        const response = await chai.request(server)
          .get('/api/v1/user/notifications')
          .set('Authorization', accessToken);
        expect(response.status).to.equal(200);
        expect(response.body[0]).to.have.deep.property('notficationId');
        expect(response.body[0].body).to
          .equal('Redneck just commented on your article: The new boston');
        expect(Array.isArray(response.body)).to.equal(true);
      }
    );

    it('Should update notificat status from unread to read',
      async () => {
        const response = await chai.request(server)
          .patch(`/api/v1/user/notifications?notificationId=${notificationId}`)
          .set('Authorization', accessToken);
        expect(response.status).to.equal(200);
      }
    );
  });
});
