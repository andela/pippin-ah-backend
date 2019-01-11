import { expect } from 'chai';

describe('Basic Test to Verify Mocha', () => {
  it('should add two numbers correctly', () => {
    const x = 5 + 5;
    expect(x).to.equal(10);
  });
});
