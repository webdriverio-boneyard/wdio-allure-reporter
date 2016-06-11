'use strict'
const expect = require('chai').expect

describe('First passing Suite', () => {
    it('with passing test in the first Suite', () => {
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

describe('Second passing Suite', () => {
    it('with passing test in the second Suite', () => {
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
