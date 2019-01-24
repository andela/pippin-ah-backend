import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

describe('PROFILE TEST SUITE', () => {
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
          .patch('/api/v1/profile')
          .set('Authorization', profileToken)
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
          .patch('/api/v1/profile')
          .set('Authorization', profileToken)
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
          .patch('/api/v1/profile')
          .set('Authorization', profileToken2)
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
          .patch('/api/v1/profile')
          .set('Authorization', profileToken2)
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
          .patch('/api/v1/profile')
          .set('Authorization', profileToken2)
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
          .patch('/api/v1/profile')
          .set('Authorization', profileToken2)
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
          .patch('/api/v1/profile')
          .set('Authorization', profileToken2)
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
      .patch('/api/v1/profile')
      .set('Authorization', profileToken2)
      .send(newProfile);
    expect(response.status).to.equal(400);
    expect(response.body.error)
      // eslint-disable-next-line max-len
      .to.equal(`Invalid categories ${expectedErrorArray}. Allowed categories are ["Science","Technology","Engineering","Arts","Mathematics"]`);
  });
});
