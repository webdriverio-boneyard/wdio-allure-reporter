'use strict'
const expect = require('chai').expect

describe('"after all" passing', () => {
    after(() => {
        return Promise.resolve()
    })

    it('with passing test', () => {
        return browser.url('/index.html')
            .waitForExist('#clickable')
            .click('#clickable')
            .getValue('#result')
            .then((value) => {
                expect(value).to.be.equal('1')
            })
    })
})
