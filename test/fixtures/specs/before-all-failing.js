'use strict'
const expect = require('chai').expect

describe('"before all" failing', () => {
    before(() => {
        throw new Error('Immediately thrown error in "before all" hook')
    })

    it('with passing test', () => {
        return browser
            .url('/index.html')
            .waitForExist('#clickable')
            .click('#clickable')
            .getValue('#result')
            .then((value) => {
                expect(value).to.be.equal(1)
            })
    })
})
