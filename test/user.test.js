import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../app';

chai.use(chaiHttp);

const { expect } = chai;

describe('Register Route: /api/v1/users/register', () => {
  it('should register a user', (done) => {
    chai.request(app)
      .post('/api/v1/users/register')
      .send({
        email: 'ezekiel@andela.com', username: 'izzy', password: '123456',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal('Registration successful');
        done();
      });
  });
});

describe('Login Route: /api/v1/users/login', () => {
  it('should login a user', (done) => {
    chai.request(app)
      .post('/api/v1/users/login')
      .send({
        username: 'ezekiel@andela.com', password: '123456',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Login successful');
        done();
      });
  });
});

describe('Get User Detail Route: /api/v1/users/:userId', () => {
  it('should get a user detail', (done) => {
    chai.request(app)
      .get('/api/v1/users/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an('object');
        done();
      });
  });
});

describe('Update User Route: /api/v1/users/:userId', () => {
  it('should update a user detail', (done) => {
    chai.request(app)
      .delete('/api/v1/users/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('User updated successfully');
        done();
      });
  });
});

describe('Delete User Route: /api/v1/users/:userId', () => {
  it('should delete a user detail', (done) => {
    chai.request(app)
      .delete('/api/v1/users/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('User deleted successfully');
        done();
      });
  });
});
