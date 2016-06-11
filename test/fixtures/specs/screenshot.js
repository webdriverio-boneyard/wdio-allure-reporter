'use strict'
const expect = require('chai').expect

describe('Screenshot during passing test', () => {
    it('with passing test', () => {
        return browser.url('/index.html')
      .waitForExist('#clickable')
      .click('#clickable')
      .screenshot()
      .getValue('#result')
      .then((value) => {
          expect(value).to.be.equal('1')
      })
    })
})
