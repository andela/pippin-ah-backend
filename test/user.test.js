import { expect } from 'chai';
import request from 'supertest';
import server from '../app';

describe('User', () => {
  it('should return password must contain at least 1 number', (done) => {
    const newUser2 = {
      username: 'habibaudu',
      email: 'auduhabib1990@gmail.com',
      password: 'hbahrhrhfghujg',
    };
    request(server)
      .post('/api/v1/user')
      .send(newUser2)
      .end((err, res) => {
        expect(res.body.message).to.equal(
          'password must contain at least 1 number');
        done();
      });
  });
  it('should return password must contain at least 1 character', (done) => {
    const newUser2 = {
      username: 'habibaudu',
      email: 'auduhabib1990@gmail.com',
      password: '1234456789',
    };
    request(server)
      .post('/api/v1/user')
      .send(newUser2)
      .end((err, res) => {
        expect(res.body.message).to.equal(
          'password must contain at least 1 character');
        done();
      });
  });
  it('should return Your password must be at least 8 characters', (done) => {
    const newUser2 = {
      username: 'habibaudu',
      email: 'auduhabib1990@gmail.com',
      password: 'hba123',
    };
    request(server)
      .post('/api/v1/user')
      .send(newUser2)
      .end((err, res) => {
        expect(res.body.message).to.equal(
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
        email: 'auduhabib1990@gmail.com',
        password: 'hbasdg3546',
      };
      request(server)
        .post('/api/v1/user')
        .send(newUser2)
        .end((err, res) => {
          expect(res.body.message).to.equal(
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
