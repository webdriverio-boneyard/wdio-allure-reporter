'use strict'

var expect = require('chai').expect

describe('"before all" passing', () => {
    before(() => {
        return browser.url('/index.html')
    })

    it('with passing test', () => {
        return browser
      .waitForExist('#clickable')
      .click('#clickable')
      .getValue('#result')
      .then((value) => {
          expect(value).to.be.equal('1')
      })
    })
})
