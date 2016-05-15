'use strict';

var expect = require('chai').expect;

describe('"after all" failing', () => {

  after(() => {
    return browser.url('/index.html')
      .pause(100)
      .then(() => {
        throw new Error('Async error in "after all" hook')
      })
  })

  it('with passing test', () => {
    return browser
      .waitForExist('#clickable')
      .click('#clickable')
      .getValue('#result')
      .then((value) => {
        expect(value).to.be.equal(1)
      })
  })

})
