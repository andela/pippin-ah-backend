import { expect } from 'chai';
import request from 'supertest';
import server from '../app';

describe('User', () => {
<<<<<<< HEAD
  it('password must contain only numbers and alphabet', (done) => {
    const newUser2 = {
      username: 'habibaudu',
      email: 'auduhabib1990@gmail.com',
      password: 'hhrt----',
=======
  it('should return password must contain at least 1 number', (done) => {
    const newUser2 = {
      username: 'habibaudu',
      email: 'auduhabib1990@gmail.com',
      password: 'hbahrhrhfghujg',
>>>>>>> feat(descriptive error):create a userValidations.js
    };
    request(server)
      .post('/api/v1/user')
      .send(newUser2)
      .end((err, res) => {
        expect(res.body.message).to.equal(
<<<<<<< HEAD
          'password must contain only numbers and alphabet');
        done();
      });
  });
  it('should return Your password must be at least 8 characters', (done) => {
    const newUser2 = {
      username: 'habibaudu',
      email: 'auduhabib1990@gmail.com',
      password: 'hba123',
=======
          'password must contain at least 1 number');
        done();
      });
  });
  it('should return password must contain at least 1 character', (done) => {
    const newUser2 = {
      username: 'habibaudu',
      email: 'auduhabib1990@gmail.com',
      password: '1234456789',
>>>>>>> feat(descriptive error):create a userValidations.js
    };
    request(server)
      .post('/api/v1/user')
      .send(newUser2)
      .end((err, res) => {
        expect(res.body.message).to.equal(
<<<<<<< HEAD
          'Your password must be at least 8 characters');
        done();
      });
  });

  it('should return Your username must be at least 6 characters', (done) => {
    const newUser2 = {
      username: 'habib',
      email: 'auduhabib1990@gmail.com',
      password: 'hbasdg3546',
=======
          'password must contain at least 1 character');
        done();
      });
  });
  it('should return Your password must be at least 8 characters', (done) => {
    const newUser2 = {
      username: 'habibaudu',
      email: 'auduhabib1990@gmail.com',
      password: 'hba123',
>>>>>>> feat(descriptive error):create a userValidations.js
    };
    request(server)
      .post('/api/v1/user')
      .send(newUser2)
      .end((err, res) => {
        expect(res.body.message).to.equal(
<<<<<<< HEAD
          'Your username must be at least 6 characters');
        done();
      });
  });
  it('should return username must contain only alphabets and numbers',
    (done) => {
      const newUser2 = {
        username: '------------',
=======
          'Your password must be at least 8 characters');
        done();
      });
  });
  it('should return password is required and must not contain space character',
    (done) => {
      const newUser2 = {
        username: 'habibaudu',
        email: 'auduhabib1990@gmail.com',
        password: ' ',
      };
      request(server)
        .post('/api/v1/user')
        .send(newUser2)
        .end((err, res) => {
          expect(res.body.message).to.equal(
            'password is required and must not contain space character');
          done();
        });
    });
  it('should return username must be alphabetic, can contain spaces and "-"',
    (done) => {
      const newUser2 = {
        username: 'hbd85969',
>>>>>>> feat(descriptive error):create a userValidations.js
        email: 'auduhabib1990@gmail.com',
        password: 'hbasdg3546',
      };
      request(server)
        .post('/api/v1/user')
        .send(newUser2)
        .end((err, res) => {
          expect(res.body.message).to.equal(
<<<<<<< HEAD
            'username must contain only alphabets and numbers');
          done();
        });
    });

=======
            'username must be alphabetic, can contain spaces and "-"');
          done();
        });
    });
  it('should return Your username must be at least 6 characters', (done) => {
    const newUser2 = {
      username: 'habib',
      email: 'auduhabib1990@gmail.com',
      password: 'hbasdg3546',
    };
    request(server)
      .post('/api/v1/user')
      .send(newUser2)
      .end((err, res) => {
        expect(res.body.message).to.equal(
          'Your username must be at least 6 characters');
        done();
      });
  });
  it('should return username must contain at least one character', (done) => {
    const newUser2 = {
      username: '------------',
      email: 'auduhabib1990@gmail.com',
      password: 'hbasdg3546',
    };
    request(server)
      .post('/api/v1/user')
      .send(newUser2)
      .end((err, res) => {
        expect(res.body.message).to.equal(
          'username must contain at least one character');
        done();
      });
  });

  it('should return username field needs additional characters', (done) => {
    const newUser2 = {
      username: 'hh          w     ',
      email: 'auduhabib1990@gmail.com',
      password: 'hbasdg3546',
    };
    request(server)
      .post('/api/v1/user')
      .send(newUser2)
      .end((err, res) => {
        expect(res.body.message).to.equal(
          'username field needs additional characters');
        done();
      });
  });
>>>>>>> feat(descriptive error):create a userValidations.js
  it('should return username field is required', (done) => {
    const newUser2 = {
      username: '',
      email: 'auduhabib1990@gmail.com',
      password: 'hbasdg3546',
    };
    request(server)
      .post('/api/v1/user')
      .send(newUser2)
      .end((err, res) => {
        expect(res.body.message).to.equal(
          'username field is required');
        done();
      });
  });
  it('should return please Enter a valid Email', (done) => {
    const newUser2 = {
      username: 'hbabsgdhh',
      email: 'auduhabib19gmail.com',
      password: 'hbasdg3546',
    };
    request(server)
      .post('/api/v1/user')
      .send(newUser2)
      .end((err, res) => {
        expect(res.body.message).to.equal(
          'please Enter a valid Email');
        done();
      });
  });
  it('should return All fields are required', (done) => {
    const newUser2 = {
      username: '',
      email: '',
      password: '',
    };
    request(server)
      .post('/api/v1/user')
      .send(newUser2)
      .end((err, res) => {
        expect(res.body.message).to.equal(
          'All fields are required');
        done();
      });
  });
});
