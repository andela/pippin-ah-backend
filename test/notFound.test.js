import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);

describe('404 TEST SUITE', () => {
  it('should reply with 404 error', (done) => {
    chai.request(app)
      .get('/random-rounte')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.errors.body[0]).to.equal('Route not found');
        done();
      });
  });
});
