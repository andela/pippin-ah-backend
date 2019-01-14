import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';

import 'babel-polyfill';
import server from '../app';

chai.use(chaiHttp);

describe('AUTHENTICATION TEST SUITE', () => {
  before(() => models.sequelize.sync({ force: true }));

  describe('JWT AUTHENTICATION', () => {
    it('should return a token on successful registration',
      (done) => {
        const newUser2 = {
          username: 'habibaudu',
          email: 'auduhabib1990@gmail.com',
          password: 'hhrt----',
        };
        chai.request(server)
          .post('/api/v1/users')
          .send(newUser2)
          .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body.token).to.not.equal(undefined);
            done();
          });
      });
    it('should return a token on successful login',
      (done) => {
        const newUser2 = {
          username: 'habibaudu',
          email: 'auduhabib1990@gmail.com',
          password: 'hhrt----',
        };
        chai.request(server)
          .post('/api/v1/users/login')
          .send(newUser2)
          .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body.token).to.not.equal(undefined);
            done();
          });
      });
  });
});


describe('USER TEST SUITE', () => {
  before(() => models.sequelize.sync({ force: true }));

  describe('User Signup Validations', () => {
    it('should fail creation if password contains special characters',
      (done) => {
        const newUser2 = {
          username: 'habibaudu',
          email: 'auduhabib1990@gmail.com',
          password: 'hhrt----',
        };
        chai.request(server)
          .post('/api/v1/users')
          .send(newUser2)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.errors.body[0]).to.equal(
              'password must contain only numbers and alphabet');
            done();
          });
      });

    it('should successfully create user when valid params are supplied',
      (done) => {
        const newUser2 = {
          username: 'habibaudu',
          email: 'auduhabib1990@gmail.com',
          password: 'hhrtuyhgt678',
        };
        chai.request(server)
          .post('/api/v1/users')
          .send(newUser2)
          .end((err, res) => {
            expect(res.status).to.equal(201);
            done();
          });
      });

    it('should fail creation when email is already in use',
      (done) => {
        const newUser2 = {
          username: 'habibaudu',
          email: 'auduhabib1990@gmail.com',
          password: 'hhrtuyhgt678',
        };
        chai.request(server)
          .post('/api/v1/users')
          .send(newUser2)
          .end((err, res) => {
            expect(res.status).to.equal(409);
            expect(res.body.errors.body[0]).to.equal(
              'Email already in use');
            done();
          });
      });

    it('should fail creation when case is changed for used email',
      (done) => {
        const newUser2 = {
          username: 'habibaudu',
          email: 'Auduhabib1990@gmail.com',
          password: 'hhrtuyhgt678',
        };
        chai.request(server)
          .post('/api/v1/users')
          .send(newUser2)
          .end((err, res) => {
            expect(res.status).to.equal(409);
            expect(res.body.errors.body[0]).to.equal(
              'Email already in use');
            done();
          });
      });

    it('should fail creation when username is already in use',
      (done) => {
        const newUser2 = {
          username: 'habibaudu',
          email: 'auduhabib@gmail.com',
          password: 'hhrtuyhgt678',
        };
        chai.request(server)
          .post('/api/v1/users')
          .send(newUser2)
          .end((err, res) => {
            expect(res.status).to.equal(409);
            expect(res.body.errors.body[0]).to.equal(
              'Username already in use');
            done();
          });
      });

    it('should fail creation when case is changed for used username',
      (done) => {
        const newUser2 = {
          username: 'Habibaudu',
          email: 'auduhabib@gmail.com',
          password: 'hhrtuyhgt678',
        };
        chai.request(server)
          .post('/api/v1/users')
          .send(newUser2)
          .end((err, res) => {
            expect(res.status).to.equal(409);
            expect(res.body.errors.body[0]).to.equal(
              'Username already in use');
            done();
          });
      });

    it('should not allow user creation when password is less than 8 characters',
      (done) => {
        const newUser2 = {
          username: 'habibaudu',
          email: 'auduhabib1990@gmail.com',
          password: 'hba123',
        };
        chai.request(server)
          .post('/api/v1/users')
          .send(newUser2)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.errors.body[0]).to.equal(
              'Your password must be at least 8 characters');
            done();
          });
      });

    it('should not allow user creation whenn username is not up to 6 chars',
      (done) => {
        const newUser2 = {
          username: 'habib',
          email: 'auduhabib1990@gmail.com',
          password: 'hbasdg3546',
        };
        chai.request(server)
          .post('/api/v1/users')
          .send(newUser2)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.errors.body[0]).to.equal(
              'Your username must be at least 6 characters');
            done();
          });
      });

    it('should only allow alphanumeric usernames',
      (done) => {
        const newUser2 = {
          username: '------------',
          email: 'auduhabib1990@gmail.com',
          password: 'hbasdg3546',
        };
        chai.request(server)
          .post('/api/v1/users')
          .send(newUser2)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.errors.body[0]).to.equal(
              'username must contain only alphabets and numbers');
            done();
          });
      });

    it('should only allow valid emails', (done) => {
      const newUser2 = {
        username: 'hbabsgdhh',
        email: 'auduhabib19gmail.com',
        password: 'hbasdg3546',
      };
      chai.request(server)
        .post('/api/v1/users')
        .send(newUser2)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors.body[0]).to.equal(
            'please Enter a valid Email');
          done();
        });
    });

    it('should not allow creation when fields are empty', (done) => {
      const newUser2 = {
        username: '',
        email: '',
        password: '',
      };
      chai.request(server)
        .post('/api/v1/users')
        .send(newUser2)
        .end((err, res) => {
          const errorResult = JSON.parse(res.body.errors.body[0]);
          expect(res.status).to.equal(400);
          expect(errorResult.length).to.equal(3);
          // eslint-disable-next-line no-unused-expressions
          expect(Array.isArray(errorResult)).to.be.true;
          expect(errorResult[0]).to.equal('username must not be empty');
          done();
        });
    });

    it('should not allow creation when required params are not provided',
      (done) => {
        const newUser2 = {
          username: 'abatamaya',
        };
        chai.request(server)
          .post('/api/v1/users')
          .send(newUser2)
          .end((err, res) => {
            const errorResult = JSON.parse(res.body.errors.body[0]);
            expect(res.status).to.equal(400);
            expect(errorResult.length).to.equal(2);
            // eslint-disable-next-line no-unused-expressions
            expect(Array.isArray(errorResult)).to.be.true;
            expect(errorResult[0]).to.equal('email is required');
            expect(errorResult[1]).to.equal('password is required');
            done();
          });
      });
  });

  describe('User SignIn Validations', () => {
    it('should sign user in with valid email and password',
      (done) => {
        const newUser2 = {
          usernameOrEmail: 'auduhabib1990@gmail.com',
          password: 'hhrtuyhgt678'
        };
        chai.request(server)
          .post('/api/v1/users/login')
          .send(newUser2)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Login was successful');
            done();
          });
      });

    it('should sign user in with valid username and password',
      (done) => {
        const newUser2 = {
          usernameOrEmail: 'habibaudu',
          password: 'hhrtuyhgt678'
        };
        chai.request(server)
          .post('/api/v1/users/login')
          .send(newUser2)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Login was successful');
            done();
          });
      });

    it('should not allow  invalid email or password signIn',
      (done) => {
        const newUser2 = {
          usernameOrEmail: 'auduhabib0@gmail.com',
          password: 'invalidpassword'
        };
        chai.request(server)
          .post('/api/v1/users/login')
          .send(newUser2)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.errors.body[0]).to.equal('Invalid Credentials');
            done();
          });
      });

    it('should not allow invalid password signIn',
      (done) => {
        const newUser2 = {
          usernameOrEmail: 'auduhabib1990@gmail.com',
          password: 'invalidpassword'
        };
        chai.request(server)
          .post('/api/v1/users/login')
          .send(newUser2)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.errors.body[0]).to.equal('Invalid Password');
            done();
          });
      });

    it('should not login user when required params are not provided',
      (done) => {
        const newUser2 = {

        };
        chai.request(server)
          .post('/api/v1/users/login')
          .send(newUser2)
          .end((err, res) => {
            const errorResult = JSON.parse(res.body.errors.body[0]);
            expect(res.status).to.equal(400);
            // eslint-disable-next-line no-unused-expressions
            expect(Array.isArray(errorResult)).to.be.true;
            expect(errorResult[0]).to.equal('usernameOrEmail is required');
            expect(errorResult[1]).to.equal('password is required');
            done();
          });
      });

    it('should not allow login when fields are empty', (done) => {
      const newUser2 = {
        UsernameOrEmail: '  ',
        password: '   ',
      };
      chai.request(server)
        .post('/api/v1/users/login')
        .send(newUser2)
        .end((err, res) => {
          const errorResult = JSON.parse(res.body.errors.body[0]);
          expect(res.status).to.equal(400);

          // eslint-disable-next-line no-unused-expressions
          expect(Array.isArray(errorResult)).to.be.true;
          expect(errorResult[0]).to.equal('usernameOrEmail is required');
          done();
        });
    });

    it('should not allow login when username is empty', (done) => {
      const newUser2 = {
        username: '    ',
        password: 'hhrtuyhgt678',
      };
      chai.request(server)
        .post('/api/v1/users/login')
        .send(newUser2)
        .end((err, res) => {
          const errorResult = JSON.parse(res.body.errors.body[0]);
          expect(res.status).to.equal(400);
          // eslint-disable-next-line no-unused-expressions
          expect(Array.isArray(errorResult)).to.be.true;
          expect(errorResult[0]).to.equal('usernameOrEmail is required');
          done();
        });
    });

    it('should not allow creation when fields are empty', (done) => {
      const newUser2 = {
        usernameOrEmail: '',
        password: '',
      };
      chai.request(server)
        .post('/api/v1/users/login')
        .send(newUser2)
        .end((err, res) => {
          const errorResult = JSON.parse(res.body.errors.body[0]);
          expect(res.status).to.equal(400);
          expect(errorResult.length).to.equal(2);
          // eslint-disable-next-line no-unused-expressions
          expect(Array.isArray(errorResult)).to.be.true;
          expect(errorResult[0]).to.equal('usernameOrEmail must not be empty');
          expect(errorResult[1]).to.equal('password must not be empty');
          done();
        });
    });
  });
});
