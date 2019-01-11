import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import 'babel-polyfill';
import server from '../app';

chai.use(chaiHttp);

describe('Test suite for post/user', () => {
  it('should return password must contain only numbers and alphabet',
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
  it('should return status code of 201',
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
  it('should return Email already in use',
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
  it('should return Email already in use',
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
  it('should return Your password must be at least 8 characters', (done) => {
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

  it('should return Your username must be at least 6 characters', (done) => {
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
  it('should return username must contain only alphabets and numbers',
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

  it('should username must contain only alphabets and numbers', (done) => {
    const newUser2 = {
      username: '',
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
  it('should return please Enter a valid Email', (done) => {
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
});
