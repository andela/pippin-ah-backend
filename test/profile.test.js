import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

describe('USER TEST SUITE', () => {
  let profileToken, profileToken2;
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
    profileToken = responseObject.body.token;

    const responseObject2 = await chai.request(server).post('/api/v1/users')
      .send(requestObject2);
    profileToken2 = responseObject2.body.token;
  });

  describe('TEST SUITS FOR PROFILE', () => {
    it('Should update profile when Valid inputs are supplied',
      async () => {
        const newProfile = {
          category: 'Science',
          firstName: 'Moses',
          lastName: 'Ezen',
          bio: 'sofware developer at google'
        };
        const response = await chai.request(server)
          .patch('/api/v1/profile')
          .set('Authorization', profileToken)
          .send(newProfile);
        expect(response.body.category).to.equal('Science');
        expect(response.body.firstName).to.equal('Moses');
        expect(response.body.lastName).to.equal('Ezen');
        expect(response.body.bio).to.equal('sofware developer at google');

        expect(response.body.message).to.equal(
          'Profile updated successfully');
      });

    it('Should update profile when few Valid inputs are supplied',
      async () => {
        const newProfile = {
          imageUrl: true
        };
        const response = await chai.request(server)
          .patch('/api/v1/profile')
          .set('Authorization', profileToken)
          .send(newProfile);
        expect(response.body.message).to.equal(
          'Profile updated successfully');
      });


    it('Should not update profile if first Name is not alphabetic',
      async () => {
        const newProfile = {
          category: 'Science',
          firstName: '6789032%^&*',
          lastName: 'Ezen',
          bio: 'sofware developer at google'
        };
        const response = await chai.request(server)
          .patch('/api/v1/profile')
          .set('Authorization', profileToken2)
          .send(newProfile);
        expect(response.status).to.equal(400);
        expect(response.body.error)
          .to.equal(
            'first Name  must be alphabets');
      });


    it('Should not update profile if last Name is not alphabetic',
      async () => {
        const newProfile = {
          category: 'Science',
          firstName: 'james',
          lastName: '8990&**^',
          bio: 'sofware developer at google'
        };
        const response = await chai.request(server)
          .patch('/api/v1/profile')
          .set('Authorization', profileToken2)
          .send(newProfile);
        expect(response.status).to.equal(400);
        expect(response.body.error)
          .to.equal(
            'last Name  must be alphabets');
      });


    it('Should not update profile if characters less than 2',
      async () => {
        const newProfile = {
          category: 'Science',
          firstName: 'james',
          lastName: 'S',
          bio: 'sofware developer at google'
        };
        const response = await chai.request(server)
          .patch('/api/v1/profile')
          .set('Authorization', profileToken2)
          .send(newProfile);
        expect(response.status).to.equal(400);
        expect(response.body.error)
          .to.equal(
            'first Name and Last name must be atleast 2 chracter long');
      });

    it('Should not update profile if characters less than 2',
      async () => {
        const newProfile = {
          category: 'Science',
          firstName: 'j',
          lastName: 'Samuel',
          bio: 'sofware developer at google'
        };
        const response = await chai.request(server)
          .patch('/api/v1/profile')
          .set('Authorization', profileToken2)
          .send(newProfile);
        expect(response.status).to.equal(400);
        expect(response.body.error)
          .to.equal(
            'first Name and Last name must be atleast 2 chracter long');
      });


    it('Should not update profile if given an Invalid Category',
      async () => {
        const newProfile = {
          category: 'Programing',
          firstName: 'james',
          lastName: 'Sadiq',
          bio: 'sofware developer at google'
        };
        const response = await chai.request(server)
          .patch('/api/v1/profile')
          .set('Authorization', profileToken2)
          .send(newProfile);
        expect(response.status).to.equal(400);
        expect(response.body.error)
          .to.equal(
            'Invalid category, Enter Science,Technology...');
      });
  });
});
