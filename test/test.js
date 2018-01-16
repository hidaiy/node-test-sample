var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});

describe('index.js only mocha', function() {
  const hello = require('../index');
  it('hello', function() {
    assert.equal(hello(), 'hello');
  });
});


const chai = require('chai');
const expect = chai.expect
describe('index.js with chai', function() {
  const hello = require('../index');
  it('hello', function() {
    expect(hello()).to.be.a('string');
    expect(hello()).to.equal('hello');
    expect(hello()).to.have.length(5);
    expect(hello()).to.equal('hello').with.length(5);
  });
});
