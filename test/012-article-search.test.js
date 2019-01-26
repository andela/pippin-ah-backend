import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

const baseUrl = '/api/v1';
const articleUrl = '/api/v1/articles';

chai.use(chaiHttp);

describe('GET MULTIPLE ARTICLES', () => {
  before(async () => {
    await models.sequelize.sync({ force: true });

    const responseObjectDavid = await chai.request(server)
      .post(`${baseUrl}/users`)
      .send({
        username: 'davidhook',
        email: 'davidhook@hotmail.com',
        password: 'davidhook345'
      });
    const davidsToken = responseObjectDavid.body.token;
    const responseObjectJane = await chai.request(server)
      .post(`${baseUrl}/users`)
      .send({
        username: 'janesmith',
        email: 'janesmith@hotmail.com',
        password: 'janesmith123'
      });
    const janesToken = responseObjectJane.body.token;

    const davidArticle1 = {
      title: 'My best Day',
      body: 'It was a great moment',
      description: 'Experience Recap',
      category: 'Arts'
    };

    const davidArticle2 = {
      title: 'Developer in a great World',
      body: 'Relocating to get a job',
      description: 'Travel',
      category: 'Science'
    };

    const janeArticle1 = {
      title: 'Calculating Fast',
      body: 'I used to be a slow',
      description: 'Learning like a developer',
      category: 'Engineering'
    };

    const janeArticle2 = {
      title: 'The road to the top',
      body: 'Becoming a world class developer',
      description: 'Growth Mindset',
      category: 'Engineering'
    };

    await chai.request(server)
      .post(articleUrl)
      .send(davidArticle1)
      .set('Authorization', davidsToken);

    await chai.request(server)
      .patch(`${articleUrl}/tag`)
      .send({
        title: 'My best Day',
        tags: 'Jobs'
      })
      .set('Authorization', davidsToken);

    await chai.request(server)
      .post(articleUrl)
      .send(davidArticle2)
      .set('Authorization', davidsToken);

    await chai.request(server)
      .post(articleUrl)
      .send(janeArticle1)
      .set('Authorization', janesToken);

    await chai.request(server)
      .patch(`${articleUrl}/tag`)
      .send({
        title: 'Calculating Fast',
        tags: 'Jobs'
      })
      .set('Authorization', janesToken);

    await chai.request(server)
      .patch(`${articleUrl}/tag`)
      .send({
        title: 'Calculating Fast',
        tags: 'Skills'
      })
      .set('Authorization', janesToken);

    await chai.request(server)
      .post(articleUrl)
      .send(janeArticle2)
      .set('Authorization', janesToken);

    await chai.request(server)
      .patch(`${baseUrl}/profile`)
      .send({
        firstName: 'david',
        lastName: 'hook'
      })
      .set('Authorization', davidsToken);

    await chai.request(server)
      .patch(`${baseUrl}/profile`)
      .send({
        firstName: 'jane',
        lastName: 'smith'
      })
      .set('Authorization', janesToken);
  });

  describe('Get Article', () => {
    it('should get all articles when no filter is supplied',
      async () => {
        const response = await chai.request(server)
          .get(articleUrl);
        expect(response.status).to.equal(200);
        expect(response.body.count).to.equal(4);
      });

    it('should ignore invalid filters',
      async () => {
        const response = await chai.request(server)
          .get(`${articleUrl}?invalidfilter=invalid`);
        expect(response.status).to.equal(200);
        expect(response.body.count).to.equal(4);
      });

    it('should get only articles with keyword in title, body or description',
      async () => {
        const response = await chai.request(server)
          .get(`${articleUrl}?keywords=developer`);
        expect(response.status).to.equal(200);
        expect(response.body.count).to.equal(3);
      });

    it('should return 400 error when invalid category is provided',
      async () => {
        const response = await chai.request(server)
          .get(`${articleUrl}?category=Music`);
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('Invalid category Music');
      });

    it('should get all articles in provided category if valid',
      async () => {
        const response = await chai.request(server)
          .get(`${articleUrl}?category=Engineering`);
        expect(response.body.count).to.equal(2);
      });

    it('should get all articles of provided author if first name is supplied',
      async () => {
        const response = await chai.request(server)
          .get(`${articleUrl}?author=Jane`);
        expect(response.body.count).to.equal(2);
      });

    it('should get all articles of provided author if last name is supplied',
      async () => {
        const response = await chai.request(server)
          .get(`${articleUrl}?author=smith`);
        expect(response.body.count).to.equal(2);
      });

    it('should get all articles of provided author if username is supplied',
      async () => {
        const response = await chai.request(server)
          .get(`${articleUrl}?author=davidhook`);
        expect(response.body.count).to.equal(2);
      });

    it('should get all articles of provided author in the provided category',
      async () => {
        const response = await chai.request(server)
          .get(`${articleUrl}?author=david&category=Arts`);
        expect(response.body.count).to.equal(1);
      });

    it('should get all articles with supplied tag',
      async () => {
        const response = await chai.request(server)
          .get(`${articleUrl}?tag=jobs`);
        expect(response.body.count).to.equal(2);
      });

    it('should get all articles with supplied tag and author',
      async () => {
        const response = await chai.request(server)
          .get(`${articleUrl}?tag=skills&author=jane`);
        expect(response.body.count).to.equal(1);
      });

    it('should combine several filters in getting just the matching article(s)',
      async () => {
        const response = await chai.request(server)
          .get(
            `${articleUrl}?tag=jobs&author=david&category=Arts&keywords=great`
          );
        expect(response.body.count).to.equal(1);
      });
  });
});
