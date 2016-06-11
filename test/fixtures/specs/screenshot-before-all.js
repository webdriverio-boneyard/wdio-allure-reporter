'use strict'
const expect = require('chai').expect

describe('Screenshot during "before all" hook', () => {
    before(() => {
        return browser.url('/index.html').screenshot()
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
