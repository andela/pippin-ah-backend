import { expect } from 'chai';
import { convertToArray, getReadTime } from '../helpers';

describe('HELPER TEST SUITE', () => {
  describe('convertToArray test suite', () => {
    it('Should convert a string to an array', (done) => {
      const result = convertToArray('Science');
      expect(result[0]).to.equal('Science');
      expect(Array.isArray(result)).to.equal(true);
      done();
    });

    it('Should convert an object to an array', (done) => {
      const result = convertToArray({ name: 'science' });
      expect(Array.isArray(result)).to.equal(true);
      done();
    });

    it('Should return the same input if an array is supplied', (done) => {
      const result = convertToArray(['Science']);
      expect(result[0]).to.equal('Science');
      done();
    });

    it('Should not throw up a TypeError when no input is supplied', (done) => {
      const result = convertToArray();
      expect(typeof (result)).to.equal('object');
      done();
    });
  });

  describe('getReadTime test suite', () => {
    it('Should return 1 for texts less than 550 words', (done) => {
      const readTime = getReadTime('There is fire on the mountain');
      expect(readTime).to.equal(1);
      done();
    });

    it('Should get the read time of texts with over 550 words', (done) => {
      const readTime = getReadTime('word '.repeat(1000));
      expect(readTime).to.equal(3);
      done();
    });
  });
});
