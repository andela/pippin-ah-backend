import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../models';
import server from '../app';

chai.use(chaiHttp);

const { User } = models;
const baseUrl = '/api/v1/users';

describe.only('USER TEST SUITE', () => {
  let firstUserToken, firstUserID;

  before(async () => {
    await models.sequelize.sync({ force: true });

    const requestObject = {
      username: 'johnsolomon',
      email: 'john@solomon.com',
      password: 'johnny777'
    };

    const responseObject = await chai.request(server).post(`${baseUrl}`)
      .send(requestObject);
    firstUserToken = responseObject.body.token;

    const firstUserObject = await User.findOne({
      where: { username: 'johnsolomon' }
    });
    firstUserID = firstUserObject.id;
  });

  describe('ACTIVATE USER', () => {
    it('should successfully activate a user', async () => {
      const response = await chai.request(server)
        .get(`/api/v1/user/activate/${firstUserID}`)
        .set('Authorization', firstUserToken);
      const activationMessageSubstring = 'Your account has been activated';
      const { message } = response.body;
      expect(message.includes(activationMessageSubstring)).to.equal(true);
    });
  });

  describe('User Signup Validations', () => {
    it('should fail creation if password contains special characters',
      (done) => {
        const userRequestObject = {
          username: 'janesmith',
          email: 'habib180@gmail.com',
          password: 'hhrt----',
        };
        chai.request(server)
          .post(`${baseUrl}`)
          .send(userRequestObject)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.error).to.equal(
              'password must contain only numbers and alphabets');
            done();
          });
      });

    it('should successfully create user when valid params are supplied',
      (done) => {
        const userRequestObject = {
          username: 'janesmith',
          email: 'habib180@gmail.com',
          password: 'hhrtuyhgt678',
        };
        chai.request(server)
          .post(`${baseUrl}`)
          .send(userRequestObject)
          .end((err, res) => {
            expect(res.body.message).to.equal(
              'An email has been sent to your email address');
            expect(res.status).to.equal(201);
            done();
          });
      });

    it('should fail creation when email is already in use',
      (done) => {
        const userRequestObject = {
          username: 'janesmith',
          email: 'habib180@gmail.com',
          password: 'hhrtuyhgt678',
        };
        chai.request(server)
          .post(`${baseUrl}`)
          .send(userRequestObject)
          .end((err, res) => {
            expect(res.status).to.equal(409);
            expect(res.body.error).to.equal(
              'Email already in use');
            done();
          });
      });

    it('should fail creation when case is changed for used email',
      (done) => {
        const userRequestObject = {
          username: 'janesmith',
          email: 'habib180@gmail.com',
          password: 'hhrtuyhgt678',
        };
        chai.request(server)
          .post(`${baseUrl}`)
          .send(userRequestObject)
          .end((err, res) => {
            expect(res.status).to.equal(409);
            expect(res.body.error).to.equal(
              'Email already in use');
            done();
          });
      });

    it('should fail creation when username is already in use',
      (done) => {
        const userRequestObject = {
          username: 'janesmith',
          email: 'auduhabib@gmail.com',
          password: 'hhrtuyhgt678',
        };
        chai.request(server)
          .post(`${baseUrl}`)
          .send(userRequestObject)
          .end((err, res) => {
            expect(res.status).to.equal(409);
            expect(res.body.error).to.equal(
              'Username already in use');
            done();
          });
      });

    it('should fail creation when case is changed for used username',
      (done) => {
        const userRequestObject = {
          username: 'janesmith',
          email: 'auduhabib@gmail.com',
          password: 'hhrtuyhgt678',
        };
        chai.request(server)
          .post(`${baseUrl}`)
          .send(userRequestObject)
          .end((err, res) => {
            expect(res.status).to.equal(409);
            expect(res.body.error).to.equal(
              'Username already in use');
            done();
          });
      });

    it('should not allow user creation when password is less than 8 characters',
      (done) => {
        const userRequestObject = {
          username: 'janesmith',
          email: 'habib180@gmail.com',
          password: 'hba123',
        };
        chai.request(server)
          .post(`${baseUrl}`)
          .send(userRequestObject)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.error).to.equal(
              'Your password must be at least 8 characters');
            done();
          });
      });

    it('should not allow user creation whenn username is not up to 6 chars',
      (done) => {
        const userRequestObject = {
          username: 'habib',
          email: 'habib180@gmail.com',
          password: 'hbasdg3546',
        };
        chai.request(server)
          .post(`${baseUrl}`)
          .send(userRequestObject)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.error).to.equal(
              'Your username must be at least 6 characters');
            done();
          });
      });

    it('should only allow alphanumeric usernames',
      (done) => {
        const userRequestObject = {
          username: '------------',
          email: 'habib180@gmail.com',
          password: 'hbasdg3546',
        };
        chai.request(server)
          .post(`${baseUrl}`)
          .send(userRequestObject)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.error).to.equal(
              'username must contain only alphabets and numbers');
            done();
          });
      });

    it('should only allow valid emails', (done) => {
      const userRequestObject = {
        username: 'hbabsgdhh',
        email: 'auduhabib19gmail.com',
        password: 'hbasdg3546',
      };
      chai.request(server)
        .post(`${baseUrl}`)
        .send(userRequestObject)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal(
            'please Enter a valid Email');
          done();
        });
    });

    it('should not allow creation when fields are empty', (done) => {
      const userRequestObject = {
        username: '',
        email: '',
        password: '',
      };
      chai.request(server)
        .post(`${baseUrl}`)
        .send(userRequestObject)
        .end((err, res) => {
          const errorResult = JSON.parse(res.body.error);
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
        const userRequestObject = {
          username: 'abatamaya',
        };
        chai.request(server)
          .post(`${baseUrl}`)
          .send(userRequestObject)
          .end((err, res) => {
            const errorResult = JSON.parse(res.body.error);
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
        const userRequestObject = {
          usernameOrEmail: 'habib180@gmail.com',
          password: 'hhrtuyhgt678'
        };
        chai.request(server)
          .post(`${baseUrl}/login`)
          .send(userRequestObject)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Login was successful');
            done();
          });
      });

    it('should sign user in with valid username and password',
      (done) => {
        const userRequestObject = {
          usernameOrEmail: 'janesmith',
          password: 'hhrtuyhgt678'
        };
        chai.request(server)
          .post(`${baseUrl}/login`)
          .send(userRequestObject)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Login was successful');
            done();
          });
      });

    it('should not allow invalid email signIn',
      (done) => {
        const userRequestObject = {
          usernameOrEmail: 'auduhabib0@gmail.com',
          password: 'invalidpassword'
        };
        chai.request(server)
          .post(`${baseUrl}/login`)
          .send(userRequestObject)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.error).to.equal('Invalid Credentials');
            done();
          });
      });

    it('should not allow invalid password signIn',
      (done) => {
        const userRequestObject = {
          usernameOrEmail: 'habib180@gmail.com',
          password: 'invalidpassword'
        };
        chai.request(server)
          .post(`${baseUrl}/login`)
          .send(userRequestObject)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.error).to.equal('Invalid Password');
            done();
          });
      });

    it('should not login user when required params are not provided',
      (done) => {
        chai.request(server)
          .post(`${baseUrl}/login`)
          .send({})
          .end((err, res) => {
            const errorResult = JSON.parse(res.body.error);
            expect(res.status).to.equal(400);
            // eslint-disable-next-line no-unused-expressions
            expect(Array.isArray(errorResult)).to.be.true;
            expect(errorResult[0]).to.equal('usernameOrEmail is required');
            expect(errorResult[1]).to.equal('password is required');
            done();
          });
      });

    it('should not allow login when fields are empty', (done) => {
      const userRequestObject = {
        usernameOrEmail: '  ',
        password: '   ',
      };
      chai.request(server)
        .post(`${baseUrl}/login`)
        .send(userRequestObject)
        .end((err, res) => {
          const errorResult = JSON.parse(res.body.error);
          expect(res.status).to.equal(400);
          // eslint-disable-next-line no-unused-expressions
          expect(Array.isArray(errorResult)).to.be.true;
          expect(errorResult[0]).to.equal('usernameOrEmail must not be empty');
          done();
        });
    });
  });

  describe('Get a single User', () => {
    it('Should get a user with valid user id present in database', async () => {
      const response = await chai.request(server).get('/api/v1/user')
        .set('Authorization', firstUserToken);
      expect(response.body.username).to.equal('johnsolomon');
    });

    it('Should not get a user when the token is not provided',
      async () => {
        const response = await chai.request(server).get('/api/v1/user');
        expect(response.body.error).to.equal('No token provided');
      });

    it('Should not get a user when invalid token is provided',
      async () => {
        const response = await chai.request(server).get('/api/v1/user')
          .set('Authorization', 'fjjdfjdjfdjfjf');
        expect(response.body.error).to.equal('Invalid token');
      });
  });

  describe('User Update Validations', () => {
    it('Should not allow update when no token is provided',
      async () => {
        const response = await chai.request(server)
          .patch('/api/v1/user');
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('No token provided');
      });

    it('Should not allow update when token is Invalid',
      async () => {
        const response = await chai.request(server)
          .patch('/api/v1/user')
          .set('Authorization', 'invalidtoken');
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('Invalid token');
      });

    it('Should successfully update when correct parameters are provided',
      async () => {
        const userObject = {
          email: 'talkto@gmail.com',
          username: 'talktoat',
          password: 'htryuufhfhdgsgggx'
        };
        const response = await chai.request(server)
          .patch('/api/v1/user')
          .send(userObject)
          .set('Authorization', firstUserToken);
        expect(response.body.message).to.equal('User Updated Successfully');
        expect(response.body.username).to.equal('talktoat');
        expect(response.body.email).to.equal('talkto@gmail.com');
        expect(response.body.isMentor).to.equal(false);
      });

    it('Should not allow update when username already exists',
      async () => {
        const userRequestObject = {
          username: 'talktoat',
        };
        const response = await chai.request(server)
          .patch('/api/v1/user')
          .send(userRequestObject)
          .set('Authorization', firstUserToken);
        expect(response.body.error).to.equal('Username already in use');
      });

    it('Should not allow update when email already exists',
      async () => {
        const userRequestObject = {
          email: 'talkto@gmail.com',
        };
        const response = await chai.request(server)
          .patch('/api/v1/user')
          .send(userRequestObject)
          .set('Authorization', firstUserToken);
        expect(response.body.error).to.equal(
          'Email already in use');
      });

    it('Should not allow update when password fails to meet rules',
      async () => {
        const userRequestObject = {
          email: 'talktogmail.com',
          username: 'Andela2',
          password: '*&^%$#@$%^^'
        };
        const response = await chai.request(server)
          .patch('/api/v1/user')
          .send(userRequestObject)
          .set('Authorization', firstUserToken);
        expect(response.body.error).to.equal(
          'password must contain only numbers and alphabets');
      });

    it('Should allow update even if no details are changed',
      async () => {
        const response = await chai.request(server)
          .patch('/api/v1/user')
          .send({})
          .set('Authorization', firstUserToken);
        expect(response.status).to.equal(200);
      });
  });

  describe('PASSWORD RESET', () => {
    it('should respond with 400 error when usernameOrEmail is a not provided',
      async () => {
        const response = await
        chai.request(server).post(`${baseUrl}/resetpassword`);
        expect(response.body.error).to
          .equal('usernameOrEmail param is missing, empty or invalid');
      });
    it('should respond with 400 error when usernameOrEmail is a not a string',
      async () => {
        const response = await
        chai.request(server).post(`${baseUrl}/resetpassword`)
          .send({ usernameOrEmail: [] });
        expect(response.body.error).to
          .equal('usernameOrEmail param is missing, empty or invalid');
      });

    it('should respond with 404 error when user is not found',
      async () => {
        const response = await
        chai.request(server).post(`${baseUrl}/resetpassword`)
          .send({ usernameOrEmail: 'fakeuser' });
        expect(response.body.error).to
          .equal('user not found');
      });

    it('should succesfully send reset link to valid user\'s mail',
      async () => {
        const response = await
        chai.request(server).post(`${baseUrl}/resetpassword`)
          .send({ usernameOrEmail: 'habib180@gmail.com' });
        expect(response.body.message).to
          .equal('A reset link has been sent to your mail');
      });
  });
});
