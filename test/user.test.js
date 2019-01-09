import chaiHttp from 'chai-http';
import chai from 'chai';
import app from '../app';

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);

describe('Home route', () => {
  it('Returns a response if route is not found', (done) => {
    chai.request(app)
      .get('/nonroute')
      .end((err, res) => {
        // eslint-disable-next-line no-console
        console.log(res.status);
        done();
      });
  });
});
