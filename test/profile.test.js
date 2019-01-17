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
    it('Should create profile when Valid inputs are supplied',
      (done) => {
        const newProfile = {
          category: 'Science',
          firstName: 'Moses',
          lastName: 'Ezen',
          bio: 'sofware developer at google'
        };
        chai.request(server)
          .post('/api/v1/profile')
          .set('Authorization', profileToken)
          .send(newProfile)
          .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body.message).to.equal(
              'Profile created successfully');
            done();
          });
      });

    it('Should not create profile if user profile already exist',
      (done) => {
        const newProfile = {
          category: 'Science',
          firstName: 'Chidinma',
          lastName: 'Ezen',
          bio: 'sofware developer at google'
        };
        chai.request(server)
          .post('/api/v1/profile')
          .set('Authorization', profileToken)
          .send(newProfile)
          .end((err, res) => {
            expect(res.status).to.equal(409);
            expect(res.body.error)
              .to.equal(
                'Already have a profile, can only have one profile,Go update.');
            done();
          });
      });

    it('Should not create profile if first Name is not alphabetic',
      (done) => {
        const newProfile = {
          category: 'Science',
          firstName: '6789032%^&*',
          lastName: 'Ezen',
          bio: 'sofware developer at google'
        };
        chai.request(server)
          .post('/api/v1/profile')
          .set('Authorization', profileToken2)
          .send(newProfile)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.error)
              .to.equal(
                'first Name  must be alphabets');
            done();
          });
      });

    it('Should not create profile if last Name is not alphabetic',
      (done) => {
        const newProfile = {
          category: 'Science',
          firstName: 'james',
          lastName: '8990&**^',
          bio: 'sofware developer at google'
        };
        chai.request(server)
          .post('/api/v1/profile')
          .set('Authorization', profileToken2)
          .send(newProfile)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.error)
              .to.equal(
                'last Name  must be alphabets');
            done();
          });
      });

    it('Should not create profile if characters less than 2',
      (done) => {
        const newProfile = {
          category: 'Science',
          firstName: 'james',
          lastName: 'S',
          bio: 'sofware developer at google'
        };
        chai.request(server)
          .post('/api/v1/profile')
          .set('Authorization', profileToken2)
          .send(newProfile)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.error)
              .to.equal(
                'first Name and Last name must be atleast 2 chracter long');
            done();
          });
      });

    it('Should not create profile if given an Invalid Category',
      (done) => {
        const newProfile = {
          category: 'Programing',
          firstName: 'james',
          lastName: 'Sadiq',
          bio: 'sofware developer at google'
        };
        chai.request(server)
          .post('/api/v1/profile')
          .set('Authorization', profileToken2)
          .send(newProfile)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.error)
              .to.equal(
                'Invalid category, Enter Science,Technology...');
            done();
          });
      });
  });
});
