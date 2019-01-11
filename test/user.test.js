import { expect } from 'chai';
import request from 'supertest';
import 'babel-polyfill';
import server from '../app';

describe('User', () => {
  it('password must contain only numbers and alphabet', (done) => {
    const newUser2 = {
      username: 'habibaudu',
      email: 'auduhabib1990@gmail.com',
      password: 'hhrt----',
    };
    request(server)
      .post('/api/v1/users')
      .send(newUser2)
      .end((err, res) => {
        expect(res.body.message).to.equal(
          'password must contain only numbers and alphabet');
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
      .post('/api/v1/users')
      .send(newUser2)
      .end((err, res) => {
        expect(res.body.message).to.equal(
          'Your password must be at least 8 characters');
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
      .post('/api/v1/users')
      .send(newUser2)
      .end((err, res) => {
        expect(res.body.message).to.equal(
          'Your username must be at least 6 characters');
        done();
      });
  });
  it('should return username must contain only alphabets and numbers',
    (done) => {
      const newUser2 = {
        username: '------------',
        email: 'auduhabib1990@gmail.com',
        password: 'hbasdg3546',
      };
      request(server)
        .post('/api/v1/users')
        .send(newUser2)
        .end((err, res) => {
          expect(res.body.message).to.equal(
            'username must contain only alphabets and numbers');
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
      .post('/api/v1/users')
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
      .post('/api/v1/users')
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
      .post('/api/v1/users')
      .send(newUser2)
      .end((err, res) => {
        expect(res.body.message).to.equal(
          'All fields are required');
        done();
      });
  });
});
