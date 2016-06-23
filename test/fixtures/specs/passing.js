'use strict'
const expect = require('chai').expect

describe('A passing Suite', () => {
    it('with passing test', () => {
        return browser
          .url('/index.html')
          .waitForExist('#clickable')
          .click('#clickable')
          .getValue('#result')
          .then((value) => {
              expect(value).to.be.equal('1')
          })
    })
})
