'use strict';

var expect = require('chai').expect;

describe('"after all" failing', () => {

  after(() => {
    throw new Error('Immediately thrown error in "after all" hook')
  })

  it('with passing test', () => {
    return browser
      .url('/index.html')
      .waitForExist('#clickable')
      .click('#clickable')
      .getValue('#result')
      .then((value) => {
        expect(value).to.be.equal(1);
      })
  })

})
