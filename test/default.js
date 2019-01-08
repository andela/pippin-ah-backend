import { assert } from 'chai';

describe('Basic Test to Verify Mocha', () => {
  it('should add two numbers correctly', () => {
    const x = 5 + 5;
    assert(x === 10, 'x should equal 10');
  });
  it('should return first character of the string', () => {
    assert('Welcome'.charAt(0) === 'W', 'First in Welcome character is W');
  });
});
