'use strict'
const expect = require('chai').expect

describe('A top-level Suite', () => {
    describe('Nested Suite', () => {
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

        describe('in another nested Suite', () => {
            it('also with passing test', () => {
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
    })
})
